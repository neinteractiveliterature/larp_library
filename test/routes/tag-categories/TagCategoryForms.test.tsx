import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { data, redirect } from 'react-router';

import ColorPicker from '~/components/ColorPicker';
import IconSelect from '~/components/IconSelect';
import EditTagCategoryPage from '~/routes/tag-categories/EditTagCategoryPage';
import NewTagCategoryPage from '~/routes/tag-categories/NewTagCategoryPage';
import { renderRouteModule, selectReactSelectOption } from '../../testUtils';

/** The action stand-in tests give a page: it records the JSON the page submitted, and then does what the test asks */
function recordingAction(respond: () => unknown = () => redirect('/tag_categories')) {
  const submitted: unknown[] = [];
  const action = async ({ request }: { request: Request }) => {
    submitted.push(await request.json());
    return respond();
  };
  return { action, submitted };
}

describe('NewTagCategoryPage', () => {
  function renderNewPage(action: ReturnType<typeof recordingAction>['action'] = recordingAction().action) {
    return renderRouteModule(
      { default: NewTagCategoryPage, loader: () => null, action },
      { route: '/tag_categories/new' },
    );
  }

  it('creates a tag category with a name and icon, then returns to the list', async () => {
    const user = userEvent.setup();
    const { action, submitted } = recordingAction();
    renderNewPage(action);

    expect(await screen.findByRole('heading', { name: 'Create a new tag category' })).toBeInTheDocument();
    await user.type(screen.getByLabelText('Name'), 'Structure');
    await selectReactSelectOption(user, screen.getByLabelText('Icon'), 'bank', { typeText: 'bank' });
    await user.click(screen.getByRole('button', { name: 'Create tag category' }));

    await vi.waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/tag_categories'));
    expect(submitted).toEqual([{ tagCategoryAttributes: { name: 'Structure', color: null, icon: 'bank' } }]);
  });

  it('labels the icon select, so clicking the label or using a screen reader reaches the field', async () => {
    renderNewPage();

    expect(await screen.findByLabelText('Icon')).toBe(screen.getByRole('combobox'));
  });

  it('shows what the server says is wrong, and stays on the page', async () => {
    const user = userEvent.setup();
    const { action } = recordingAction(() => data({ errors: ['Name has already been taken'] }, { status: 422 }));
    renderNewPage(action);

    await user.type(await screen.findByLabelText('Name'), 'Dupe');
    await user.click(screen.getByRole('button', { name: 'Create tag category' }));

    expect(await screen.findByText(/Name has already been taken/)).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/tag_categories/new');
  });
});

describe('EditTagCategoryPage', () => {
  const genre = { id: 3, name: 'Genre', color: '#112233', textColor: '#ffffff', icon: 'film' };
  const loaderData = {
    tagCategory: genre,
    tags: [
      { id: 11, name: 'comedy', tagCategory: genre },
      { id: 12, name: 'drama', tagCategory: genre },
    ],
  };

  const renderEditPage = (action: ReturnType<typeof recordingAction>['action'] = recordingAction().action) =>
    renderRouteModule(
      { default: EditTagCategoryPage, loader: () => loaderData, action },
      { route: '/tag_categories/3/edit', path: '/tag_categories/:tagCategoryId/edit' },
    );

  it('shows the category and links to the tags in it', async () => {
    renderEditPage();

    expect(await screen.findByRole('heading', { name: 'Editing tag category: Genre' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'comedy' })).toHaveAttribute('href', '/tags/11/edit');
    expect(screen.getByRole('link', { name: 'drama' })).toHaveAttribute('href', '/tags/12/edit');
    expect(screen.getByLabelText('Name')).toHaveValue('Genre');
  });

  it('saves changes and returns to the list', async () => {
    const user = userEvent.setup();
    const { action, submitted } = recordingAction();
    renderEditPage(action);

    await user.type(await screen.findByLabelText('Name'), 's');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    await vi.waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/tag_categories'));
    expect(submitted).toEqual([
      { intent: 'save', tagCategoryAttributes: { name: 'Genres', color: '#112233', icon: 'film' } },
    ]);
  });

  it('shows what the server says is wrong with the changes', async () => {
    const user = userEvent.setup();
    const { action } = recordingAction(() => data({ errors: ['Color is invalid'] }, { status: 422 }));
    renderEditPage(action);

    await user.click(await screen.findByRole('button', { name: 'Save changes' }));

    expect(await screen.findByText(/Color is invalid/)).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/tag_categories/3/edit');
  });

  it('deletes the category after confirmation', async () => {
    const user = userEvent.setup();
    const { action, submitted } = recordingAction();
    renderEditPage(action);

    await user.click(await screen.findByRole('button', { name: 'Delete tag category' }));
    expect(await screen.findByText('Are you sure you want to delete the tag category Genre?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'OK', hidden: true }));

    await vi.waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/tag_categories'));
    expect(submitted).toEqual([{ intent: 'delete' }]);
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
