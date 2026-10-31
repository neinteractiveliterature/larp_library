import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ColorPicker from '../ColorPicker';
import IconSelect from '../IconSelect';
import EditTagCategoryPage from './EditTagCategoryPage';
import NewTagCategoryPage from './NewTagCategoryPage';
import { CreateTagCategoryDocument, DeleteTagCategoryDocument, UpdateTagCategoryDocument } from './mutations.generated';
import { EditTagCategoryQueryDocument } from './queries.generated';
import { buildTag, buildTagCategory, resetFixtureIds } from '../../../test/javascript/fixtures';
import { MockedResponse, renderPage, selectReactSelectOption } from '../../../test/javascript/testUtils';

describe('NewTagCategoryPage', () => {
  beforeEach(() => resetFixtureIds());

  it('creates a tag category with a name and icon, then returns to the list', async () => {
    const user = userEvent.setup();
    let sent: unknown;
    renderPage(<NewTagCategoryPage />, {
      route: '/tag_categories/new',
      mocks: [
        {
          request: { query: CreateTagCategoryDocument },
          variableMatcher: () => true,
          result: (variables: unknown) => {
            sent = variables;
            return {
              data: {
                createTagCategory: { __typename: 'CreateTagCategoryPayload', tagCategory: buildTagCategory() },
              },
            };
          },
        },
      ],
    });

    expect(screen.getByRole('heading', { name: 'Create a new tag category' })).toBeInTheDocument();
    await user.type(screen.getByLabelText('Name'), 'Structure');
    await selectReactSelectOption(user, screen.getByRole('combobox'), 'bank', { typeText: 'bank' });
    await user.click(screen.getByRole('button', { name: 'Create tag category' }));

    await vi.waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/tag_categories'));
    expect(sent).toEqual({ tagCategoryAttributes: { name: 'Structure', color: undefined, icon: 'bank' } });
  });

  it('shows the error if creating fails', async () => {
    const user = userEvent.setup();
    renderPage(<NewTagCategoryPage />, {
      route: '/tag_categories/new',
      mocks: [
        {
          request: { query: CreateTagCategoryDocument },
          variableMatcher: () => true,
          // the page doesn't catch the failed mutation, so the browser logs an unhandled rejection as well
          error: new Error('[expected unhandled] name is required'),
        },
      ],
    });

    await user.click(screen.getByRole('button', { name: 'Create tag category' }));

    expect(await screen.findByText(/name is required/)).toBeInTheDocument();
  });
});

describe('EditTagCategoryPage', () => {
  beforeEach(() => resetFixtureIds());

  const category = () => buildTagCategory({ id: '3', name: 'Genre', color: '#112233', icon: 'film' });

  function editMock(): MockedResponse {
    const genre = category();
    return {
      request: { query: EditTagCategoryQueryDocument, variables: { id: '3' } },
      result: {
        data: {
          tagCategory: {
            ...genre,
            tags: [
              buildTag({ id: 't1', name: 'comedy', tagCategory: genre }),
              buildTag({ id: 't2', name: 'drama', tagCategory: genre }),
            ],
          },
        },
      },
    };
  }

  const renderEditPage = (mocks: MockedResponse[]) =>
    renderPage(<EditTagCategoryPage />, {
      mocks,
      route: '/tag_categories/3/edit',
      path: '/tag_categories/:tagCategoryId/edit',
    });

  it('shows the category and links to the tags in it', async () => {
    renderEditPage([editMock()]);

    expect(await screen.findByRole('heading', { name: 'Editing tag category: Genre' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'comedy' })).toHaveAttribute('href', '/tags/t1/edit');
    expect(screen.getByRole('link', { name: 'drama' })).toHaveAttribute('href', '/tags/t2/edit');
    expect(screen.getByLabelText('Name')).toHaveValue('Genre');
  });

  it('saves changes and returns to the list', async () => {
    const user = userEvent.setup();
    let sent: unknown;
    renderEditPage([
      editMock(),
      {
        request: { query: UpdateTagCategoryDocument },
        variableMatcher: () => true,
        result: (variables: unknown) => {
          sent = variables;
          return {
            data: { updateTagCategory: { __typename: 'UpdateTagCategoryPayload', tagCategory: category() } },
          };
        },
      },
    ]);

    await user.type(await screen.findByLabelText('Name'), 's');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    await vi.waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/tag_categories'));
    expect(sent).toEqual({
      id: '3',
      tagCategoryAttributes: { name: 'Genres', color: '#112233', icon: 'film' },
    });
  });

  it('deletes the category after confirmation', async () => {
    const user = userEvent.setup();
    let deleted = false;
    renderEditPage([
      editMock(),
      {
        request: { query: DeleteTagCategoryDocument, variables: { id: '3' } },
        result: () => {
          deleted = true;
          return { data: { deleteTagCategory: { __typename: 'DeleteTagCategoryPayload', clientMutationId: null } } };
        },
      },
    ]);

    await user.click(await screen.findByRole('button', { name: 'Delete tag category' }));
    expect(await screen.findByText('Are you sure you want to delete the tag category Genre?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'OK', hidden: true }));

    await vi.waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/tag_categories'));
    expect(deleted).toBe(true);
  });
});

describe('ColorPicker', () => {
  it('reports a typed hex color', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ColorPicker value="#112233" onChange={onChange} />);

    const hexInput = screen.getAllByRole('textbox')[0];
    expect(hexInput).toHaveValue('#112233');
    await user.clear(hexInput);
    await user.type(hexInput, '#ff0000');

    await waitFor(() => expect(onChange).toHaveBeenCalledWith('#ff0000'));
  });

  it('starts out black when there is no color yet', () => {
    render(<ColorPicker value={null} onChange={() => {}} />);

    expect(screen.getAllByRole('textbox')[0]).toHaveValue('#000000');
  });
});

describe('IconSelect', () => {
  it('shows the selected icon', () => {
    render(<IconSelect value="film" onChange={() => {}} />);

    expect(screen.getByText('film')).toBeInTheDocument();
  });

  it('filters icons by what was typed, putting prefix matches first', async () => {
    const user = userEvent.setup();
    render(<IconSelect value={undefined} onChange={() => {}} />);

    await user.click(screen.getByRole('combobox'));
    await user.type(screen.getByRole('combobox'), 'arrow-up');

    const options = await screen.findAllByRole('option');
    expect(options.length).toBeGreaterThan(1);
    expect(options[0].textContent?.trim()).toMatch(/^arrow-up/);
  });

  it('selects an icon and clears it again', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<IconSelect value="film" onChange={onChange} />);

    await selectReactSelectOption(user, screen.getByRole('combobox'), 'bank', { typeText: 'bank' });
    expect(onChange).toHaveBeenLastCalledWith('bank');

    await user.click(screen.getByRole('combobox'));
    await user.keyboard('{Backspace}');
    expect(onChange).toHaveBeenLastCalledWith(undefined);
  });

  it('shows the first icons when the input is blank', async () => {
    const user = userEvent.setup();
    render(<IconSelect value={undefined} onChange={() => {}} />);

    await user.click(screen.getByRole('combobox'));
    await user.keyboard('{ArrowDown}');

    expect((await screen.findAllByRole('option')).length).toBe(50);
  });
});
