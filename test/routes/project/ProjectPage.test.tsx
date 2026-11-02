import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { redirect } from 'react-router';

import ProjectFileDisplay from '~/components/project/ProjectFileDisplay';
import ProjectPage from '~/routes/project/ProjectPage';
import type { ProjectFileData, ProjectPageData } from '~/.server/lib/projects.server';
import { buildFile, buildLink, buildProject } from '../../projectFixtures';
import { renderRouteModule } from '../../testUtils';

/** A project seen by someone who can't do anything to it, which is what most of these tests are about */
const asVisitor = (overrides: Partial<ProjectPageData['project']> = {}) =>
  buildProject({
    description: 'About the **big** larp.',
    currentUserCanEdit: false,
    currentUserCanDelete: false,
    currentUserCanUploadFiles: false,
    currentUserCanDeleteFiles: false,
    ...overrides,
  });

function renderProjectPage(
  project: ProjectPageData['project'],
  action: (args: { request: Request }) => unknown = () => redirect('/projects'),
) {
  return renderRouteModule(
    { default: ProjectPage, loader: () => ({ project }), action },
    { route: '/brands/b/projects/7-the-big-larp', path: '/brands/:brandSlug/projects/:projectId' },
  );
}

describe('ProjectPage', () => {
  it('shows the project, its description and its license', async () => {
    renderProjectPage(asVisitor({ tags: [{ id: 1, name: 'comedy', tagCategory: null }] }));

    expect(await screen.findByRole('link', { name: 'The Big Larp' })).toBeInTheDocument();
    expect(screen.getByText('big').tagName).toEqual('STRONG');
    expect(screen.getByText('comedy')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'CC BY' })).toHaveAttribute(
      'href',
      'https://creativecommons.org/licenses/by/4.0/',
    );
    expect(screen.getByRole('link', { name: 'CC BY' })).toHaveAttribute('rel', 'license');
    // no permissions, so no editing or deleting
    expect(screen.queryByRole('link', { name: 'Edit project' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete project' })).not.toBeInTheDocument();
  });

  it('labels the card "Downloads" when the project only has files', async () => {
    renderProjectPage(asVisitor({ projectFiles: [buildFile({ filename: 'rules.pdf' })] }));

    expect(await screen.findByRole('heading', { name: 'Downloads' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /rules\.pdf/ })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Links' })).not.toBeInTheDocument();
  });

  it('labels the card "Content" when the project only has links', async () => {
    renderProjectPage(asVisitor({ projectLinks: [buildLink({ title: 'Official site' })] }));

    expect(await screen.findByRole('heading', { name: 'Content' })).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /Official site/ });
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('separates downloads from links, in the order the loader gave them', async () => {
    renderProjectPage(
      asVisitor({
        projectFiles: [
          buildFile({ filename: 'first.pdf', position: 1 }),
          buildFile({ filename: 'second.pdf', position: 2 }),
        ],
        projectLinks: [buildLink({ title: 'Link A', position: 1 }), buildLink({ title: 'Link B', position: 2 })],
      }),
    );

    expect(await screen.findByRole('heading', { name: 'Downloads' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Links' })).toBeInTheDocument();
    const names = screen.getAllByRole('link').map((link) => link.textContent?.trim());
    expect(names.indexOf('first.pdf')).toBeLessThan(names.indexOf('second.pdf'));
    expect(names.indexOf('Link A')).toBeLessThan(names.indexOf('Link B'));
  });

  it('shows a custom dedication and the license logo when the license has them', async () => {
    renderProjectPage(
      asVisitor({
        license: {
          id: 'cc0',
          name: 'CC0',
          url: 'https://example.com/cc0',
          logoUrl: 'https://example.com/cc0.png',
          dedicationHtml: '<p>Dedicated to the <em>public domain</em>.</p>',
          discouraged: false,
          discouragedReason: null,
        },
      }),
    );

    expect(await screen.findByText('public domain')).toBeInTheDocument();
    expect(screen.queryByText(/This work is licensed under a/)).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'CC0' })).toHaveAttribute('src', 'https://example.com/cc0.png');
  });

  it('copes with a project that has no license or description', async () => {
    renderProjectPage(asVisitor({ license: null, description: null }));

    expect(await screen.findByRole('link', { name: 'The Big Larp' })).toBeInTheDocument();
    expect(screen.queryByText(/licensed under/)).not.toBeInTheDocument();
  });

  it('offers editing to people who can edit', async () => {
    renderProjectPage(asVisitor({ currentUserCanEdit: true }));

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
    const deleted = vi.fn();
    renderProjectPage(asVisitor({ currentUserCanDelete: true }), () => {
      deleted();
      return redirect('/projects');
    });

    await user.click(await screen.findByRole('button', { name: 'Delete project' }));
    expect(await screen.findByText(/completely delete The Big Larp/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'OK', hidden: true }));

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/projects'));
    expect(deleted).toHaveBeenCalledTimes(1);
  });

  it('does not delete when the confirmation is cancelled', async () => {
    const user = userEvent.setup();
    const deleted = vi.fn();
    renderProjectPage(asVisitor({ currentUserCanDelete: true }), () => {
      deleted();
      return redirect('/projects');
    });

    await user.click(await screen.findByRole('button', { name: 'Delete project' }));
    await user.click(await screen.findByRole('button', { name: 'Cancel', hidden: true }));

    expect(screen.getByTestId('location')).toHaveTextContent('/brands/b/projects/7-the-big-larp');
    expect(deleted).not.toHaveBeenCalled();
  });
});

describe('ProjectFileDisplay', () => {
  const fileOf = (overrides: Partial<ProjectFileData>) =>
    buildFile({ filename: 'thing', filesize: 100, filetype: 'application/octet-stream', ...overrides });

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
