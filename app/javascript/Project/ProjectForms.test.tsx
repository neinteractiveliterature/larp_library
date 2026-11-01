import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditorView } from '@codemirror/view';

import * as EditProjectPage from './EditProjectPage';
import * as NewProjectPage from './NewProjectPage';
import * as ProjectInitialContentPage from './ProjectInitialContentPage';
import { CreateProjectDocument, UpdateProjectDocument } from './mutations.generated';
import { NewProjectFormQueryDocument, ProjectPageQueryDocument } from './queries.generated';
import { TagAutocompleteQueryDocument } from '../Tags/queries.generated';
import {
  buildConnection,
  buildLicense,
  buildProjectFields,
  buildProjectFile,
  buildProjectLink,
  buildTag,
  resetFixtureIds,
} from '../../../test/javascript/fixtures';
import { MockedResponse, renderRouteModule, selectReactSelectOption } from '../../../test/javascript/testUtils';

function setDescription(text: string) {
  const view = EditorView.findFromDOM(document.querySelector('.cm-editor') as HTMLElement)!;
  act(() => view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } }));
}

const licenses = [
  buildLicense({ id: 'lic-1', name: 'CC BY' }),
  buildLicense({ id: 'lic-2', name: 'CC BY-NC', discouraged: true, discouragedReason: 'non-commercial only' }),
];

const noTagResults: MockedResponse = {
  request: { query: TagAutocompleteQueryDocument },
  variableMatcher: () => true,
  maxUsageCount: Number.POSITIVE_INFINITY,
  result: { data: { tags: buildConnection([] as { id: string }[]) } },
};

describe('NewProjectPage', () => {
  beforeEach(() => resetFixtureIds());

  const newProjectMock: MockedResponse = {
    request: { query: NewProjectFormQueryDocument, variables: { slug: 'acme' } },
    // React Router reloads the page's data after an action, so the query can be asked again
    maxUsageCount: Number.POSITIVE_INFINITY,
    result: { data: { brand: { __typename: 'Brand', id: 'b1' }, licenses } },
  };

  const renderNewProjectPage = (mocks: MockedResponse[]) =>
    renderRouteModule(NewProjectPage, {
      mocks: [newProjectMock, noTagResults, ...mocks],
      route: '/brands/acme/projects/new',
      path: '/brands/:brandSlug/projects/new',
    });

  it('offers the licenses, marking discouraged ones with the reason', async () => {
    renderNewProjectPage([]);

    const select = await screen.findByLabelText('License');
    expect(within(select).getByRole('option', { name: 'CC BY' })).toBeInTheDocument();
    expect(within(select).getByRole('option', { name: 'CC BY-NC (non-commercial only)' })).toBeInTheDocument();
    expect(within(select).getByRole('option', { name: /Other license\/prefer not to specify/ })).toBeInTheDocument();
  });

  it('creates the project and continues to adding its content', async () => {
    const user = userEvent.setup();
    let sent: Record<string, unknown> | undefined;
    renderNewProjectPage([
      {
        request: { query: CreateProjectDocument },
        variableMatcher: () => true,
        result: (variables: Record<string, unknown>) => {
          sent = variables;
          return {
            data: {
              createProject: {
                __typename: 'CreateProjectPayload',
                project: buildProjectFields({ id: '55', title: 'My New Larp' }),
              },
            },
          };
        },
      },
    ]);

    await user.type(await screen.findByLabelText('Title'), 'My New Larp');
    await user.type(screen.getByLabelText('Authors'), 'Pat Author');
    await user.type(screen.getByLabelText('Publication year'), '2025');
    await user.type(screen.getByLabelText('Minimum player count'), '4');
    await user.type(screen.getByLabelText('Maximum player count'), '8');
    await user.type(screen.getByLabelText('Minimum facilitator/GM count'), '1');
    await user.type(screen.getByLabelText('Maximum facilitator/GM count'), '2');
    await user.type(screen.getByLabelText('Game length'), '3');
    await user.selectOptions(screen.getByLabelText('Length units'), 'days');
    await user.selectOptions(screen.getByLabelText('License'), 'CC BY');
    await selectReactSelectOption(user, screen.getByLabelText('Tags'), 'brand-new', { typeText: 'brand-new' });
    await waitFor(() => expect(document.querySelector('.cm-editor')).toBeInTheDocument());
    setDescription('A *great* larp.');
    await user.click(screen.getByRole('button', { name: 'Save project' }));

    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent('/brands/acme/projects/55-my-new-larp/initial_content'),
    );
    expect(sent).toEqual({
      brandId: 'b1',
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
        licenseId: 'lic-1',
        tagNames: ['brand-new'],
        description: 'A *great* larp.',
      },
    });
  });

  it('shows the error if saving fails', async () => {
    const user = userEvent.setup();
    renderNewProjectPage([
      {
        request: { query: CreateProjectDocument },
        variableMatcher: () => true,
        // the page doesn't catch the failed mutation, so the browser logs an unhandled rejection as well
        error: new Error('title is required'),
      },
    ]);

    await user.click(await screen.findByRole('button', { name: 'Save project' }));

    expect(await screen.findByText(/title is required/)).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/brands/acme/projects/new');
  });
});

describe('EditProjectPage', () => {
  beforeEach(() => resetFixtureIds());

  const project = () =>
    buildProjectFields({
      title: 'The Big Larp',
      authors: 'Pat Author',
      minPlayers: 6,
      maxPlayers: 12,
      projectFiles: [buildProjectFile({ filename: 'rules.pdf' })],
      projectLinks: [buildProjectLink({ title: 'Official site' })],
      tags: [buildTag({ name: 'comedy' })],
    });

  const projectMock = (): MockedResponse => ({
    request: { query: ProjectPageQueryDocument, variables: { projectId: '7-the-big-larp' } },
    // React Router reloads the page's data after an action, so the query can be asked again
    maxUsageCount: Number.POSITIVE_INFINITY,
    result: { data: { project: project(), licenses } },
  });

  const renderEditProjectPage = (mocks: MockedResponse[], route = '/brands/acme/projects/7-the-big-larp/edit') =>
    renderRouteModule(EditProjectPage, {
      mocks: [projectMock(), noTagResults, ...mocks],
      route,
      path: '/brands/:brandSlug/projects/:projectId/edit',
    });

  it('shows the current properties of the project', async () => {
    renderEditProjectPage([]);

    expect(await screen.findByRole('heading', { name: 'Editing project “The Big Larp”' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Back to project page/ })).toHaveAttribute(
      'href',
      '/brands/acme/projects/7-the-big-larp',
    );
    // the add/edit link modals (hidden) have Title fields too, so take the first: the project's own
    expect(screen.getAllByLabelText('Title')[0]).toHaveValue('The Big Larp');
    expect(screen.getByLabelText('Authors')).toHaveValue('Pat Author');
    expect(screen.getByLabelText('Minimum player count')).toHaveValue(6);
    expect(screen.getByLabelText('License')).toHaveValue('lic-1');
    expect(screen.getByText('comedy')).toBeInTheDocument();
  });

  it('saves changes to the properties', async () => {
    const user = userEvent.setup();
    let sent: Record<string, unknown> | undefined;
    renderEditProjectPage([
      {
        request: { query: UpdateProjectDocument },
        variableMatcher: () => true,
        result: (variables: Record<string, unknown>) => {
          sent = variables;
          return { data: { updateProject: { __typename: 'UpdateProjectPayload', project: project() } } };
        },
      },
    ]);

    await user.type((await screen.findAllByLabelText('Title'))[0], ' II');
    await user.selectOptions(screen.getByLabelText('License'), 'CC BY-NC (non-commercial only)');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(await screen.findByRole('button', { name: /Saved!/ })).toBeInTheDocument();
    expect(sent).toEqual({
      id: '7',
      projectAttributes: expect.objectContaining({
        title: 'The Big Larp II',
        licenseId: 'lic-2',
        authors: 'Pat Author',
        tagNames: ['comedy'],
      }),
    });
  });

  it('can clear the license', async () => {
    const user = userEvent.setup();
    let sent: Record<string, unknown> | undefined;
    renderEditProjectPage([
      {
        request: { query: UpdateProjectDocument },
        variableMatcher: () => true,
        result: (variables: Record<string, unknown>) => {
          sent = variables;
          return { data: { updateProject: { __typename: 'UpdateProjectPayload', project: project() } } };
        },
      },
    ]);

    await user.selectOptions(await screen.findByLabelText('License'), '_unspecified');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() =>
      expect(sent).toEqual({ id: '7', projectAttributes: expect.objectContaining({ licenseId: null }) }),
    );
  });

  it('shows the error if saving fails', async () => {
    const user = userEvent.setup();
    renderEditProjectPage([
      {
        request: { query: UpdateProjectDocument },
        variableMatcher: () => true,
        // the page doesn't catch the failed mutation, so the browser logs an unhandled rejection as well
        error: new Error('title is too long'),
      },
    ]);

    await user.click(await screen.findByRole('button', { name: 'Save changes' }));

    expect(await screen.findByText(/title is too long/)).toBeInTheDocument();
  });

  it('switches to the content tab, which shows the files and links', async () => {
    const user = userEvent.setup();
    renderEditProjectPage([]);

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
    renderEditProjectPage([], '/brands/acme/projects/7-the-big-larp/edit#content');

    expect(await screen.findByRole('link', { name: 'Project content' })).toHaveClass('active');
    expect(screen.getByRole('link', { name: 'Project properties' })).not.toHaveClass('active');
  });
});

describe('ProjectInitialContentPage', () => {
  beforeEach(() => resetFixtureIds());

  it('lets you add content and then finish', async () => {
    renderRouteModule(ProjectInitialContentPage, {
      route: '/brands/acme/projects/7-the-big-larp/initial_content',
      path: '/brands/:brandSlug/projects/:projectId/initial_content',
      mocks: [
        {
          request: { query: ProjectPageQueryDocument, variables: { projectId: '7-the-big-larp' } },
          // React Router reloads the page's data after an action, so the query can be asked again
          maxUsageCount: Number.POSITIVE_INFINITY,
          result: { data: { project: buildProjectFields(), licenses } },
        },
      ],
    });

    expect(await screen.findByRole('heading', { name: 'Content' })).toBeInTheDocument();
    expect(screen.getByText('Files')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Finish and go to project page' })).toHaveAttribute(
      'href',
      '/brands/acme/projects/7-the-big-larp',
    );
  });
});
