import { useState } from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { data, redirect } from 'react-router';

import EditTagPage from '~/routes/tags/EditTagPage';
import NewTagPage from '~/routes/tags/NewTagPage';
import TagSelector, { type TagOption } from '~/components/tags/TagSelector';
import type { TagCategoryData } from '~/lib/projectData';
import { mockFetchJson, renderPage, renderRouteModule, selectReactSelectOption } from '../../testUtils';

function tagCategory(id: number, name: string): TagCategoryData {
  return { id, name, color: '#777777', textColor: '#ffffff', icon: 'tag' };
}

/** The action stand-in tests give a page: it records the JSON the page submitted, and then does what the test asks */
function recordingAction(respond: () => unknown = () => redirect('/tags')) {
  const submitted: unknown[] = [];
  const action = async ({ request }: { request: Request }) => {
    submitted.push(await request.json());
    return respond();
  };
  return { action, submitted };
}

describe('NewTagPage', () => {
  afterEach(() => vi.restoreAllMocks());

  const genre = tagCategory(1, 'Genre');
  const element = tagCategory(2, 'Element');

  function renderNewTagPage(action: ReturnType<typeof recordingAction>['action']) {
    mockFetchJson(() => [genre, element]);
    return renderRouteModule({ default: NewTagPage, loader: () => null, action }, { route: '/tags/new' });
  }

  it('creates a tag in the chosen category and returns to the tag list', async () => {
    const user = userEvent.setup();
    const { action, submitted } = recordingAction();
    renderNewTagPage(action);

    expect(await screen.findByRole('heading', { name: 'Create a new tag' })).toBeInTheDocument();
    await user.type(screen.getByLabelText('Name'), 'comedy');
    await selectReactSelectOption(user, screen.getByLabelText('Category'), 'Genre');
    await user.click(screen.getByRole('button', { name: 'Create tag' }));

    await vi.waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/tags'));
    expect(submitted).toEqual([{ tagAttributes: { name: 'comedy', tagCategoryId: 1 } }]);
  });

  it('can create a tag without a category', async () => {
    const user = userEvent.setup();
    const { action, submitted } = recordingAction();
    renderNewTagPage(action);

    await user.type(await screen.findByLabelText('Name'), 'loose');
    await user.click(screen.getByRole('button', { name: 'Create tag' }));

    await vi.waitFor(() => expect(submitted).toEqual([{ tagAttributes: { name: 'loose', tagCategoryId: null } }]));
  });

  it('shows what the server says is wrong, and stays on the page', async () => {
    const user = userEvent.setup();
    const { action } = recordingAction(() => data({ errors: ["Name can't be blank"] }, { status: 422 }));
    renderNewTagPage(action);

    await user.click(await screen.findByRole('button', { name: 'Create tag' }));

    expect(await screen.findByText(/Name can't be blank/)).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/tags/new');
  });
});

describe('EditTagPage', () => {
  afterEach(() => vi.restoreAllMocks());

  const genre = tagCategory(1, 'Genre');
  const horde = { id: 5, name: 'horde', tagCategory: genre };

  function renderEditTagPage(
    { projectCount = 3, tag = horde }: { projectCount?: number; tag?: typeof horde } = {},
    action: ReturnType<typeof recordingAction>['action'] = recordingAction().action,
  ) {
    mockFetchJson(() => [genre]);
    return renderRouteModule(
      { default: EditTagPage, loader: () => ({ tag, projectCount }), action },
      { route: '/tags/5/edit', path: '/tags/:tagId/edit' },
    );
  }

  it('shows the tag and how many projects use it', async () => {
    renderEditTagPage();

    expect(await screen.findByRole('heading', { name: 'Editing tag: horde' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Used by 3 projects' })).toHaveAttribute('href', '/projects?tag=horde');
    expect(screen.getByLabelText('Name')).toHaveValue('horde');
  });

  it('uses the singular for a tag used by one project', async () => {
    renderEditTagPage({ projectCount: 1 });

    expect(await screen.findByRole('link', { name: 'Used by 1 project' })).toBeInTheDocument();
  });

  it('saves changes and returns to the tag list', async () => {
    const user = userEvent.setup();
    const { action, submitted } = recordingAction();
    renderEditTagPage({}, action);

    await user.type(await screen.findByLabelText('Name'), 's');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    await vi.waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/tags'));
    expect(submitted).toEqual([{ intent: 'save', tagAttributes: { name: 'hordes', tagCategoryId: 1 } }]);
  });

  it('shows what the server says is wrong with the changes', async () => {
    const user = userEvent.setup();
    const { action } = recordingAction(() => data({ errors: ['Tag category does not exist'] }, { status: 422 }));
    renderEditTagPage({}, action);

    await user.click(await screen.findByRole('button', { name: 'Save changes' }));

    expect(await screen.findByText(/Tag category does not exist/)).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/tags/5/edit');
  });

  it('deletes the tag after confirmation', async () => {
    const user = userEvent.setup();
    const { action, submitted } = recordingAction();
    renderEditTagPage({}, action);

    await user.click(await screen.findByRole('button', { name: 'Delete tag' }));
    expect(await screen.findByText('Are you sure you want to delete the tag horde?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'OK', hidden: true }));

    await vi.waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/tags'));
    expect(submitted).toEqual([{ intent: 'delete' }]);
  });
});

describe('TagSelector', () => {
  afterEach(() => vi.restoreAllMocks());

  /** The tags the server would offer, and the queries it was asked */
  function serveTags(tags: TagOption[]) {
    const queries: string[] = [];
    mockFetchJson((url) => {
      expect(url.pathname).toEqual('/tags/autocomplete');
      queries.push(url.searchParams.get('q') ?? '');
      return tags;
    });
    return queries;
  }

  function Harness<IsMulti extends boolean, IsCreatable extends boolean>({
    isMulti,
    isCreatable,
    initial,
    onValue,
  }: {
    isMulti: IsMulti;
    isCreatable: IsCreatable;
    initial: TagOption[] | TagOption | null;
    onValue: (value: unknown) => void;
  }) {
    const [value, setValue] = useState<unknown>(initial);
    return (
      <>
        <label htmlFor="tag-selector">Tags</label>
        <TagSelector
          id="tag-selector"
          isMulti={isMulti}
          isCreatable={isCreatable}
          value={value as never}
          onChange={
            ((newValue: unknown) => {
              setValue(newValue);
              onValue(newValue);
            }) as never
          }
        />
      </>
    );
  }

  const allTags = (): TagOption[] => [
    { id: 1, name: 'horde' },
    { id: 2, name: 'comedy' },
    { id: 3, name: 'heist' },
  ];

  it('picks a single tag', async () => {
    const user = userEvent.setup();
    const values: unknown[] = [];
    serveTags(allTags());
    renderPage(<Harness isMulti={false} isCreatable={false} initial={null} onValue={(v) => values.push(v)} />);

    await selectReactSelectOption(user, screen.getByLabelText('Tags'), 'comedy', { typeText: 'co' });

    expect(values).toEqual([expect.objectContaining({ id: 2, name: 'comedy' })]);
    expect(await screen.findByText('comedy')).toBeInTheDocument();
  });

  it('only offers tags that start with what was typed', async () => {
    const user = userEvent.setup();
    serveTags(allTags());
    renderPage(<Harness isMulti={false} isCreatable={false} initial={null} onValue={() => {}} />);

    await user.click(screen.getByLabelText('Tags'));
    await user.type(screen.getByLabelText('Tags'), 'he');

    expect(await screen.findByText('heist')).toBeInTheDocument();
    expect(screen.queryByText('horde')).not.toBeInTheDocument();
    expect(screen.queryByText('comedy')).not.toBeInTheDocument();
  });

  it('clears a single tag', async () => {
    const user = userEvent.setup();
    const values: unknown[] = [];
    const [horde] = allTags();
    serveTags(allTags());
    renderPage(<Harness isMulti={false} isCreatable={false} initial={horde} onValue={(v) => values.push(v)} />);

    await user.click(await screen.findByLabelText('Tags'));
    await user.keyboard('{Backspace}');

    expect(values).toEqual([null]);
  });

  it('picks several tags', async () => {
    const user = userEvent.setup();
    const values: unknown[] = [];
    serveTags(allTags());
    renderPage(<Harness isMulti isCreatable={false} initial={[]} onValue={(v) => values.push(v)} />);

    await selectReactSelectOption(user, screen.getByLabelText('Tags'), 'horde', { typeText: 'ho' });
    await selectReactSelectOption(user, screen.getByLabelText('Tags'), 'heist', { typeText: 'he' });

    expect(values.at(-1)).toEqual([expect.objectContaining({ id: 1 }), expect.objectContaining({ id: 3 })]);
  });

  it('creates a new tag from what was typed, when creatable', async () => {
    const user = userEvent.setup();
    const values: unknown[] = [];
    serveTags(allTags());
    renderPage(<Harness isMulti isCreatable initial={[]} onValue={(v) => values.push(v)} />);

    // the "create" option is rendered with the same Tag badge as real options, so it shows just the new name
    await selectReactSelectOption(user, screen.getByLabelText('Tags'), 'brand-new', { typeText: 'brand-new' });

    expect(values.at(-1)).toEqual([expect.objectContaining({ name: 'brand-new' })]);
  });

  it('creates a single new tag, when creatable', async () => {
    const user = userEvent.setup();
    const values: unknown[] = [];
    serveTags(allTags());
    renderPage(<Harness isMulti={false} isCreatable initial={null} onValue={(v) => values.push(v)} />);

    await selectReactSelectOption(user, screen.getByLabelText('Tags'), 'solo-tag', { typeText: 'solo-tag' });

    expect(values.at(-1)).toEqual(expect.objectContaining({ name: 'solo-tag' }));
  });
});
