import { useState } from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as EditTagPage from './EditTagPage';
import * as NewTagPage from './NewTagPage';
import TagSelector from './TagSelector';
import { CreateTagDocument, DeleteTagDocument, UpdateTagDocument } from './mutations.generated';
import { EditTagQueryDocument, TagAutocompleteQueryDocument, TagFragment } from './queries.generated';
import { TagCategoryAutocompleteQueryDocument } from '../TagCategories/queries.generated';
import { buildConnection, buildTag, buildTagCategory, resetFixtureIds } from '../../../test/javascript/fixtures';
import {
  MockedResponse,
  renderPage,
  renderRouteModule,
  selectReactSelectOption,
} from '../../../test/javascript/testUtils';

function categoryAutocompleteMock(categories: ReturnType<typeof buildTagCategory>[]): MockedResponse {
  return {
    request: { query: TagCategoryAutocompleteQueryDocument },
    variableMatcher: () => true,
    maxUsageCount: Number.POSITIVE_INFINITY,
    result: { data: { tagCategories: buildConnection(categories) } },
  };
}

function tagAutocompleteMock(
  tags: ReturnType<typeof buildTag>[],
  matchQueryString: (queryString: string | undefined) => boolean = () => true,
): MockedResponse {
  return {
    request: { query: TagAutocompleteQueryDocument },
    variableMatcher: (variables) => matchQueryString(variables.queryString),
    maxUsageCount: Number.POSITIVE_INFINITY,
    result: { data: { tags: buildConnection(tags) } },
  };
}

describe('NewTagPage', () => {
  beforeEach(() => resetFixtureIds());

  it('creates a tag in the chosen category and returns to the tag list', async () => {
    const user = userEvent.setup();
    const genre = buildTagCategory({ id: 'cat-1', name: 'Genre' });
    let sentAttributes: unknown;
    renderRouteModule(NewTagPage, {
      route: '/tags/new',
      path: '/tags/new',
      mocks: [
        categoryAutocompleteMock([genre, buildTagCategory({ id: 'cat-2', name: 'Element' })]),
        {
          request: { query: CreateTagDocument },
          variableMatcher: () => true,
          result: (variables: { tagAttributes: unknown }) => {
            sentAttributes = variables.tagAttributes;
            return { data: { createTag: { __typename: 'CreateTagPayload', tag: buildTag({ name: 'comedy' }) } } };
          },
        },
      ],
    });

    expect(screen.getByRole('heading', { name: 'Create a new tag' })).toBeInTheDocument();
    await user.type(screen.getByLabelText('Name'), 'comedy');
    await selectReactSelectOption(user, screen.getByLabelText('Category'), 'Genre');
    await user.click(screen.getByRole('button', { name: 'Create tag' }));

    await vi.waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/tags'));
    expect(sentAttributes).toEqual({ name: 'comedy', tagCategoryId: 'cat-1' });
  });

  it('can create a tag without a category', async () => {
    const user = userEvent.setup();
    let sentAttributes: unknown;
    renderRouteModule(NewTagPage, {
      route: '/tags/new',
      path: '/tags/new',
      mocks: [
        categoryAutocompleteMock([]),
        {
          request: { query: CreateTagDocument },
          variableMatcher: () => true,
          result: (variables: { tagAttributes: unknown }) => {
            sentAttributes = variables.tagAttributes;
            return { data: { createTag: { __typename: 'CreateTagPayload', tag: buildTag() } } };
          },
        },
      ],
    });

    await user.type(screen.getByLabelText('Name'), 'loose');
    await user.click(screen.getByRole('button', { name: 'Create tag' }));

    await vi.waitFor(() => expect(sentAttributes).toEqual({ name: 'loose', tagCategoryId: undefined }));
  });

  it('shows the error if creating the tag fails', async () => {
    const user = userEvent.setup();
    renderRouteModule(NewTagPage, {
      route: '/tags/new',
      path: '/tags/new',
      mocks: [
        categoryAutocompleteMock([]),
        {
          request: { query: CreateTagDocument },
          variableMatcher: () => true,
          error: new Error('name has already been taken'),
        },
      ],
    });

    await user.type(screen.getByLabelText('Name'), 'dupe');
    await user.click(screen.getByRole('button', { name: 'Create tag' }));

    expect(await screen.findByText(/name has already been taken/)).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/tags/new');
  });
});

describe('EditTagPage', () => {
  beforeEach(() => resetFixtureIds());

  function editTagMock(tag: ReturnType<typeof buildTag>, projectCount: number): MockedResponse {
    return {
      request: { query: EditTagQueryDocument, variables: { id: tag.id } },
      result: { data: { tag: { ...tag, projects: { __typename: 'Connection', totalCount: projectCount } } } },
    };
  }

  const renderEditTagPage = (mocks: MockedResponse[]) =>
    renderRouteModule(EditTagPage, { mocks, route: '/tags/5/edit', path: '/tags/:tagId/edit' });

  it('shows the tag and how many projects use it', async () => {
    renderEditTagPage([editTagMock(buildTag({ id: '5', name: 'horde' }), 3), categoryAutocompleteMock([])]);

    expect(await screen.findByRole('heading', { name: 'Editing tag: horde' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Used by 3 projects' })).toHaveAttribute('href', '/projects?tag=horde');
    expect(screen.getByLabelText('Name')).toHaveValue('horde');
  });

  it('uses the singular for a tag used by one project', async () => {
    renderEditTagPage([editTagMock(buildTag({ id: '5', name: 'horde' }), 1), categoryAutocompleteMock([])]);

    expect(await screen.findByRole('link', { name: 'Used by 1 project' })).toBeInTheDocument();
  });

  it('saves changes and returns to the tag list', async () => {
    const user = userEvent.setup();
    const category = buildTagCategory({ id: 'cat-1', name: 'Genre' });
    let sent: unknown;
    renderEditTagPage([
      editTagMock(buildTag({ id: '5', name: 'horde', tagCategory: category }), 3),
      categoryAutocompleteMock([category]),
      {
        request: { query: UpdateTagDocument },
        variableMatcher: () => true,
        result: (variables: unknown) => {
          sent = variables;
          return {
            data: { updateTag: { __typename: 'UpdateTagPayload', tag: buildTag({ id: '5', name: 'hordes' }) } },
          };
        },
      },
    ]);

    await user.type(await screen.findByLabelText('Name'), 's');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    await vi.waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/tags'));
    expect(sent).toEqual({ id: '5', tagAttributes: { name: 'hordes', tagCategoryId: 'cat-1' } });
  });

  it('deletes the tag after confirmation', async () => {
    const user = userEvent.setup();
    let deleted = false;
    renderEditTagPage([
      editTagMock(buildTag({ id: '5', name: 'horde' }), 0),
      categoryAutocompleteMock([]),
      {
        request: { query: DeleteTagDocument, variables: { id: '5' } },
        result: () => {
          deleted = true;
          return { data: { deleteTag: { __typename: 'DeleteTagPayload', clientMutationId: null } } };
        },
      },
    ]);

    await user.click(await screen.findByRole('button', { name: 'Delete tag' }));
    expect(await screen.findByText('Are you sure you want to delete the tag horde?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'OK', hidden: true }));

    await vi.waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/tags'));
    expect(deleted).toBe(true);
  });
});

describe('TagSelector', () => {
  beforeEach(() => resetFixtureIds());

  function Harness<IsMulti extends boolean, IsCreatable extends boolean>({
    isMulti,
    isCreatable,
    initial,
    onValue,
  }: {
    isMulti: IsMulti;
    isCreatable: IsCreatable;
    initial: TagFragment[] | TagFragment | null;
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

  const allTags = () => [
    buildTag({ id: 't1', name: 'horde' }),
    buildTag({ id: 't2', name: 'comedy' }),
    buildTag({ id: 't3', name: 'heist' }),
  ];

  it('picks a single tag', async () => {
    const user = userEvent.setup();
    const values: unknown[] = [];
    renderPage(<Harness isMulti={false} isCreatable={false} initial={null} onValue={(v) => values.push(v)} />, {
      mocks: [tagAutocompleteMock(allTags())],
    });

    await selectReactSelectOption(user, screen.getByLabelText('Tags'), 'comedy', { typeText: 'co' });

    expect(values).toEqual([expect.objectContaining({ id: 't2', name: 'comedy' })]);
    expect(await screen.findByText('comedy')).toBeInTheDocument();
  });

  it('only offers tags that start with what was typed', async () => {
    const user = userEvent.setup();
    renderPage(<Harness isMulti={false} isCreatable={false} initial={null} onValue={() => {}} />, {
      mocks: [tagAutocompleteMock(allTags())],
    });

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
    renderPage(<Harness isMulti={false} isCreatable={false} initial={horde} onValue={(v) => values.push(v)} />, {
      mocks: [tagAutocompleteMock(allTags())],
    });

    await user.click(await screen.findByLabelText('Tags'));
    await user.keyboard('{Backspace}');

    expect(values).toEqual([null]);
  });

  it('picks several tags', async () => {
    const user = userEvent.setup();
    const values: unknown[] = [];
    renderPage(<Harness isMulti isCreatable={false} initial={[]} onValue={(v) => values.push(v)} />, {
      mocks: [tagAutocompleteMock(allTags())],
    });

    await selectReactSelectOption(user, screen.getByLabelText('Tags'), 'horde', { typeText: 'ho' });
    await selectReactSelectOption(user, screen.getByLabelText('Tags'), 'heist', { typeText: 'he' });

    expect(values.at(-1)).toEqual([expect.objectContaining({ id: 't1' }), expect.objectContaining({ id: 't3' })]);
  });

  it('creates a new tag from what was typed, when creatable', async () => {
    const user = userEvent.setup();
    const values: unknown[] = [];
    renderPage(<Harness isMulti isCreatable initial={[]} onValue={(v) => values.push(v)} />, {
      mocks: [tagAutocompleteMock(allTags())],
    });

    // the "create" option is rendered with the same Tag badge as real options, so it shows just the new name
    await selectReactSelectOption(user, screen.getByLabelText('Tags'), 'brand-new', { typeText: 'brand-new' });

    expect(values.at(-1)).toEqual([expect.objectContaining({ __typename: 'Tag', name: 'brand-new' })]);
  });

  it('creates a single new tag, when creatable', async () => {
    const user = userEvent.setup();
    const values: unknown[] = [];
    renderPage(<Harness isMulti={false} isCreatable initial={null} onValue={(v) => values.push(v)} />, {
      mocks: [tagAutocompleteMock(allTags())],
    });

    await selectReactSelectOption(user, screen.getByLabelText('Tags'), 'solo-tag', { typeText: 'solo-tag' });

    expect(values.at(-1)).toEqual(expect.objectContaining({ __typename: 'Tag', name: 'solo-tag' }));
  });
});
