import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ProjectFileDisplay from './ProjectFileDisplay';
import ProjectPage from './ProjectPage';
import { ProjectPageQueryDocument } from './queries.generated';
import { DeleteProjectDocument } from './mutations.generated';
import {
  buildLicense,
  buildProjectFile,
  buildProjectHeaders,
  buildProjectLink,
  buildTag,
  resetFixtureIds,
} from '../../../test/javascript/fixtures';
import { MockedResponse, renderPage } from '../../../test/javascript/testUtils';

function buildProject(overrides: Record<string, unknown> = {}) {
  return {
    ...buildProjectHeaders({
      id: '7',
      title: 'The Big Larp',
      brand: { __typename: 'Brand', id: 'b1', name: 'Acme', slug: 'acme' },
      ...overrides,
    }),
    description: 'About the **big** larp.',
    currentUserCanEdit: false,
    currentUserCanDelete: false,
    currentUserCanUploadFiles: false,
    currentUserCanDeleteFiles: false,
    license: buildLicense({ name: 'CC BY', url: 'https://example.com/by' }) as ReturnType<typeof buildLicense> | null,
    projectFiles: [] as ReturnType<typeof buildProjectFile>[],
    projectLinks: [] as ReturnType<typeof buildProjectLink>[],
    ...overrides,
  };
}

function projectMock(project: ReturnType<typeof buildProject>): MockedResponse {
  return {
    request: { query: ProjectPageQueryDocument, variables: { projectId: '7' } },
    result: { data: { project, licenses: [buildLicense()] } },
  };
}

const renderProjectPage = (mocks: MockedResponse[]) =>
  renderPage(<ProjectPage />, {
    mocks,
    route: '/brands/b/projects/7-the-big-larp',
    path: '/brands/:brandSlug/projects/:projectId',
  });

describe('ProjectPage', () => {
  beforeEach(() => resetFixtureIds());

  it('shows the project, its description and its license', async () => {
    renderProjectPage([projectMock(buildProject({ tags: [buildTag({ name: 'comedy' })] }))]);

    expect(await screen.findByRole('link', { name: 'The Big Larp' })).toBeInTheDocument();
    expect(screen.getByText('big').tagName).toEqual('STRONG');
    expect(screen.getByText('comedy')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'CC BY' })).toHaveAttribute('href', 'https://example.com/by');
    expect(screen.getByRole('link', { name: 'CC BY' })).toHaveAttribute('rel', 'license');
    // no permissions, so no editing or deleting
    expect(screen.queryByRole('link', { name: 'Edit project' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete project' })).not.toBeInTheDocument();
  });

  it('labels the card "Downloads" when the project only has files', async () => {
    renderProjectPage([
      projectMock(buildProject({ projectFiles: [buildProjectFile({ filename: 'rules.pdf', position: 1 })] })),
    ]);

    expect(await screen.findByRole('heading', { name: 'Downloads' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /rules\.pdf/ })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Links' })).not.toBeInTheDocument();
  });

  it('labels the card "Content" when the project only has links', async () => {
    renderProjectPage([projectMock(buildProject({ projectLinks: [buildProjectLink({ title: 'Official site' })] }))]);

    expect(await screen.findByRole('heading', { name: 'Content' })).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /Official site/ });
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('separates downloads from links, each sorted by position', async () => {
    renderProjectPage([
      projectMock(
        buildProject({
          projectFiles: [
            buildProjectFile({ filename: 'second.pdf', position: 2 }),
            buildProjectFile({ filename: 'first.pdf', position: 1 }),
          ],
          projectLinks: [
            buildProjectLink({ title: 'Link B', position: 2 }),
            buildProjectLink({ title: 'Link A', position: 1 }),
          ],
        }),
      ),
    ]);

    expect(await screen.findByRole('heading', { name: 'Downloads' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Links' })).toBeInTheDocument();
    const names = screen.getAllByRole('link').map((link) => link.textContent?.trim());
    expect(names.indexOf('first.pdf')).toBeLessThan(names.indexOf('second.pdf'));
    expect(names.indexOf('Link A')).toBeLessThan(names.indexOf('Link B'));
  });

  it('shows a custom dedication and the license logo when the license has them', async () => {
    renderProjectPage([
      projectMock(
        buildProject({
          license: buildLicense({
            name: 'CC0',
            url: 'https://example.com/cc0',
            logoUrl: 'https://example.com/cc0.png',
            dedicationHtml: '<p>Dedicated to the <em>public domain</em>.</p>',
          }),
        }),
      ),
    ]);

    expect(await screen.findByText('public domain')).toBeInTheDocument();
    expect(screen.queryByText(/This work is licensed under a/)).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'CC0' })).toHaveAttribute('src', 'https://example.com/cc0.png');
  });

  it('copes with a project that has no license or description', async () => {
    renderProjectPage([projectMock(buildProject({ license: null, description: null }))]);

    expect(await screen.findByRole('link', { name: 'The Big Larp' })).toBeInTheDocument();
    expect(screen.queryByText(/licensed under/)).not.toBeInTheDocument();
  });

  it('offers editing to people who can edit', async () => {
    renderProjectPage([projectMock(buildProject({ currentUserCanEdit: true }))]);

    expect(await screen.findByRole('link', { name: 'Edit project' })).toHaveAttribute(
      'href',
      '/brands/acme/projects/7-the-big-larp/edit#properties',
    );
    expect(screen.getByRole('link', { name: 'Edit' })).toHaveAttribute(
      'href',
      '/brands/acme/projects/7-the-big-larp/edit#content',
    );
  });

  it('deletes the project after confirmation and goes back to the search page', async () => {
    const user = userEvent.setup();
    let deleted = false;
    renderProjectPage([
      projectMock(buildProject({ currentUserCanDelete: true })),
      {
        request: { query: DeleteProjectDocument, variables: { id: '7' } },
        result: () => {
          deleted = true;
          return { data: { deleteProject: { __typename: 'DeleteProjectPayload', clientMutationId: null } } };
        },
      },
    ]);

    await user.click(await screen.findByRole('button', { name: 'Delete project' }));
    expect(await screen.findByText(/completely delete The Big Larp/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'OK', hidden: true }));

    await vi.waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/projects'));
    expect(deleted).toBe(true);
  });

  it('does not delete when the confirmation is cancelled', async () => {
    const user = userEvent.setup();
    renderProjectPage([projectMock(buildProject({ currentUserCanDelete: true }))]);

    await user.click(await screen.findByRole('button', { name: 'Delete project' }));
    await user.click(await screen.findByRole('button', { name: 'Cancel', hidden: true }));

    expect(screen.getByTestId('location')).toHaveTextContent('/brands/b/projects/7-the-big-larp');
  });
});

describe('ProjectFileDisplay', () => {
  const fileOf = (overrides: Record<string, unknown>) =>
    buildProjectFile({ filename: 'thing', filesize: 100, filetype: 'application/octet-stream', ...overrides });

  it.each([
    ['application/pdf', 'bi-file-earmark-pdf'],
    ['image/png', 'bi-file-earmark-image'],
    ['text/plain', 'bi-file-earmark-text'],
    ['application/zip', 'bi-file-earmark-zip'],
    ['application/gzip', 'bi-file-earmark-zip'],
    ['application/octet-stream', 'bi-file-earmark'],
    [null, 'bi-file-earmark'],
  ])('uses the right icon for %s files', (filetype, expectedIcon) => {
    const { container } = render(<ProjectFileDisplay file={fileOf({ filetype })} />);
    expect(container.querySelector('i')).toHaveClass(expectedIcon);
  });

  it.each([
    [512, '512 bytes'],
    [2048, '2.00 KiB'],
    [5 * 1024 * 1024, '5.00 MiB'],
    [3 * 1024 * 1024 * 1024, '3.00 GiB'],
  ])('formats a file of %i bytes as %s', (filesize, expected) => {
    render(<ProjectFileDisplay file={fileOf({ filesize })} />);
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it('links to the file by name', () => {
    render(<ProjectFileDisplay file={fileOf({ filename: 'handout.pdf', url: 'https://files.example.com/h.pdf' })} />);
    const link = screen.getByRole('link', { name: /handout\.pdf/ });
    expect(link).toHaveAttribute('href', 'https://files.example.com/h.pdf');
    expect(within(link.parentElement!).getByText('100 bytes')).toBeInTheDocument();
  });
});
