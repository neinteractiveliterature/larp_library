import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditorView } from '@codemirror/view';
import { data, redirect } from 'react-router';

import EditProjectPage from '~/Project/EditProjectPage';
import NewProjectPage from '~/Project/NewProjectPage';
import ProjectInitialContentPage from '~/Project/ProjectInitialContentPage';
import { buildFile, buildLink, buildProject } from '../projectFixtures';
import { mockFetchJson, renderRouteModule, selectReactSelectOption } from '../testUtils';

function setDescription(text: string) {
  const view = EditorView.findFromDOM(document.querySelector('.cm-editor') as HTMLElement)!;
  act(() => view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } }));
}

// Real licenses, since that's the list the forms offer
const CC_BY = { id: 'cc40_by', name: 'Creative Commons Attribution 4.0 International' };
const CC_BY_NC = {
  id: 'cc40_by_nc',
  option:
    'Creative Commons Attribution-NonCommercial 4.0 International (discouraged, see our licensing page for details)',
};

type SubmittedBody = Record<string, unknown>;

/** The action stand-in tests give a page: it records the JSON the page submitted, and then does what the test asks */
function recordingAction(respond: () => unknown) {
  const submitted: SubmittedBody[] = [];
  const action = async ({ request }: { request: Request }) => {
    submitted.push(await request.json());
    return respond();
  };
  return { action, submitted };
}

describe('NewProjectPage', () => {
  afterEach(() => vi.restoreAllMocks());

  function renderNewProjectPage(
    respond: () => unknown = () => redirect('/brands/acme/projects/55-my-new-larp/initial_content'),
  ) {
    mockFetchJson(() => []);
    const { action, submitted } = recordingAction(respond);
    renderRouteModule(
      { default: NewProjectPage, loader: () => ({ brand: { id: 5, name: 'Acme', slug: 'acme' } }), action },
      { route: '/brands/acme/projects/new', path: '/brands/:brandSlug/projects/new' },
    );
    return { submitted };
  }

  it('offers the licenses, marking discouraged ones with the reason', async () => {
    renderNewProjectPage();

    const select = await screen.findByLabelText('License');
    expect(within(select).getByRole('option', { name: CC_BY.name })).toBeInTheDocument();
    expect(within(select).getByRole('option', { name: CC_BY_NC.option })).toBeInTheDocument();
    expect(within(select).getByRole('option', { name: /Other license\/prefer not to specify/ })).toBeInTheDocument();
  });

  it('creates the project and continues to adding its content', async () => {
    const user = userEvent.setup();
    const { submitted } = renderNewProjectPage();

    await user.type(await screen.findByLabelText('Title'), 'My New Larp');
    await user.type(screen.getByLabelText('Authors'), 'Pat Author');
    await user.type(screen.getByLabelText('Publication year'), '2025');
    await user.type(screen.getByLabelText('Minimum player count'), '4');
    await user.type(screen.getByLabelText('Maximum player count'), '8');
    await user.type(screen.getByLabelText('Minimum facilitator/GM count'), '1');
    await user.type(screen.getByLabelText('Maximum facilitator/GM count'), '2');
    await user.type(screen.getByLabelText('Game length'), '3');
    await user.selectOptions(screen.getByLabelText('Length units'), 'days');
    await user.selectOptions(screen.getByLabelText('License'), CC_BY.name);
    await selectReactSelectOption(user, screen.getByLabelText('Tags'), 'brand-new', { typeText: 'brand-new' });
    await waitFor(() => expect(document.querySelector('.cm-editor')).toBeInTheDocument());
    setDescription('A *great* larp.');
    await user.click(screen.getByRole('button', { name: 'Save project' }));

    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent('/brands/acme/projects/55-my-new-larp/initial_content'),
    );
    expect(submitted).toEqual([
      {
        brandId: 5,
        projectAttributes: {
          title: 'My New Larp',
          authors: 'Pat Author',
          publicationYear: 2025,
          minPlayers: 4,
          maxPlayers: 8,
          minFacilitators: 1,
          maxFacilitators: 2,
          lengthQuantity: 3,
          lengthUnits: 'days',
          licenseId: CC_BY.id,
          tagNames: ['brand-new'],
          description: 'A *great* larp.',
        },
      },
    ]);
  });

  it('shows what the server says is wrong, and stays on the page', async () => {
    const user = userEvent.setup();
    renderNewProjectPage(() => data({ errors: ['License is not included in the list'] }, { status: 422 }));

    await user.click(await screen.findByRole('button', { name: 'Save project' }));

    expect(await screen.findByText(/License is not included in the list/)).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/brands/acme/projects/new');
  });
});

describe('EditProjectPage', () => {
  afterEach(() => vi.restoreAllMocks());

  const project = () =>
    buildProject({
      title: 'The Big Larp',
      authors: 'Pat Author',
      minPlayers: 6,
      maxPlayers: 12,
      projectFiles: [buildFile({ filename: 'rules.pdf' })],
      projectLinks: [buildLink({ title: 'Official site' })],
      tags: [{ id: 1, name: 'comedy', tagCategory: null }],
    });

  function renderEditProjectPage(
    respond: () => unknown = () => ({ saved: true }),
    route = '/brands/acme/projects/7-the-big-larp/edit',
  ) {
    mockFetchJson(() => []);
    const { action, submitted } = recordingAction(respond);
    renderRouteModule(
      { default: EditProjectPage, loader: () => ({ project: project() }), action },
      { route, path: '/brands/:brandSlug/projects/:projectId/edit' },
    );
    return { submitted };
  }

  it('shows the current properties of the project', async () => {
    renderEditProjectPage();

    expect(await screen.findByRole('heading', { name: 'Editing project “The Big Larp”' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Back to project page/ })).toHaveAttribute(
      'href',
      '/brands/acme/projects/7-the-big-larp',
    );
    // the add/edit link modals (hidden) have Title fields too, so take the first: the project's own
    expect(screen.getAllByLabelText('Title')[0]).toHaveValue('The Big Larp');
    expect(screen.getByLabelText('Authors')).toHaveValue('Pat Author');
    expect(screen.getByLabelText('Minimum player count')).toHaveValue(6);
    expect(screen.getByLabelText('License')).toHaveValue(CC_BY.id);
    expect(screen.getByText('comedy')).toBeInTheDocument();
  });

  it('saves changes to the properties', async () => {
    const user = userEvent.setup();
    const { submitted } = renderEditProjectPage();

    await user.type((await screen.findAllByLabelText('Title'))[0], ' II');
    await user.selectOptions(screen.getByLabelText('License'), CC_BY_NC.option);
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(await screen.findByRole('button', { name: /Saved!/ })).toBeInTheDocument();
    expect(submitted).toEqual([
      {
        projectId: 7,
        projectAttributes: expect.objectContaining({
          title: 'The Big Larp II',
          licenseId: CC_BY_NC.id,
          authors: 'Pat Author',
          tagNames: ['comedy'],
        }),
      },
    ]);
  });

  it('can clear the license', async () => {
    const user = userEvent.setup();
    const { submitted } = renderEditProjectPage();

    await user.selectOptions(await screen.findByLabelText('License'), '_unspecified');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() =>
      expect(submitted).toEqual([{ projectId: 7, projectAttributes: expect.objectContaining({ licenseId: null }) }]),
    );
  });

  it('shows what the server says is wrong with the changes', async () => {
    const user = userEvent.setup();
    renderEditProjectPage(() =>
      data({ errors: ['License is required because this project has downloadable files'] }, { status: 422 }),
    );

    await user.click(await screen.findByRole('button', { name: 'Save changes' }));

    expect(
      await screen.findByText(/License is required because this project has downloadable files/),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Saved!/ })).not.toBeInTheDocument();
  });

  it('switches to the content tab, which shows the files and links', async () => {
    const user = userEvent.setup();
    renderEditProjectPage();

    const contentTab = await screen.findByRole('link', { name: 'Project content' });
    expect(contentTab).not.toHaveClass('active');
    await user.click(contentTab);

    await waitFor(() => expect(screen.getByRole('link', { name: 'Project content' })).toHaveClass('active'));
    expect(screen.getByRole('link', { name: 'Project properties' })).not.toHaveClass('active');
    expect(screen.getByText('Files')).toBeInTheDocument();
    expect(screen.getByText('Links')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /rules\.pdf/ })).toBeInTheDocument();
    expect(screen.getByText('Official site')).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('#content');
  });

  it('opens straight to the content tab when linked there', async () => {
    renderEditProjectPage(undefined, '/brands/acme/projects/7-the-big-larp/edit#content');

    expect(await screen.findByRole('link', { name: 'Project content' })).toHaveClass('active');
    expect(screen.getByRole('link', { name: 'Project properties' })).not.toHaveClass('active');
  });
});

describe('ProjectInitialContentPage', () => {
  it('lets you add content and then finish', async () => {
    renderRouteModule(
      { default: ProjectInitialContentPage, loader: () => ({ project: buildProject() }) },
      {
        route: '/brands/acme/projects/7-the-big-larp/initial_content',
        path: '/brands/:brandSlug/projects/:projectId/initial_content',
      },
    );

    expect(await screen.findByRole('heading', { name: 'Content' })).toBeInTheDocument();
    expect(screen.getByText('Files')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Finish and go to project page' })).toHaveAttribute(
      'href',
      '/brands/acme/projects/7-the-big-larp',
    );
  });
});
