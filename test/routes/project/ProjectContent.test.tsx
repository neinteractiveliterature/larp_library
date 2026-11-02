import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { data } from 'react-router';

import ProjectInitialContentPage from '~/routes/project/ProjectInitialContentPage';
import type { ProjectContentActionBody } from '~/routes/project/ProjectContentRoute';
import type { ProjectPageData } from '~/.server/lib/projects.server';
import { moveItem } from '~/.server/db/orderedList.server';
import { buildFile, buildLink, buildProject } from '../../projectFixtures';
import { FakeXMLHttpRequest, mockFetch, renderRouteModule } from '../../testUtils';

type Project = ProjectPageData['project'];

/** A stand-in for the server: the project it would load, and a record of what the cards asked it to change */
type FakeServer = { project: Project; submitted: ProjectContentActionBody[] };

/**
 * Renders the content page. The cards submit their changes to the content route, which here records them and lets the test
 * decide what changed (`handle`, by default nothing), after which the page reloads the project from the fake server.
 */
function renderContentPage(
  project: Project,
  handle: (body: ProjectContentActionBody, server: FakeServer) => unknown = () => undefined,
) {
  const server: FakeServer = { project, submitted: [] };

  renderRouteModule(
    { default: ProjectInitialContentPage, loader: () => ({ project: server.project }) },
    {
      route: '/brands/acme/projects/7-the-big-larp/initial_content',
      path: '/brands/:brandSlug/projects/:projectId/initial_content',
      // the file and link cards submit their changes here
      extraRoutes: [
        {
          path: '/brands/:brandSlug/projects/:projectId/content',
          module: {
            action: async ({ request }: { request: Request }) => {
              const body: ProjectContentActionBody = await request.json();
              server.submitted.push(body);
              return handle(body, server) ?? { done: body.intent };
            },
          },
        },
      ],
    },
  );
  return server;
}

describe('project links', () => {
  const link = (title: string, position: number, extra: Partial<ReturnType<typeof buildLink>> = {}) =>
    buildLink({ id: position, title, position, url: `https://example.com/${position}`, ...extra });

  it('lists the links in order', async () => {
    renderContentPage(buildProject({ projectLinks: [link('First', 1), link('Second', 2)] }));

    await screen.findByText('First');
    const titles = screen.getAllByRole('link', { name: /First|Second/ }).map((a) => a.textContent?.trim());
    expect(titles).toEqual(['First', 'Second']);
  });

  it('adds a link, then closes and clears the form', async () => {
    const user = userEvent.setup();
    const server = renderContentPage(buildProject(), (body, state) => {
      if (body.intent === 'createLink') {
        state.project = { ...state.project, projectLinks: [link('Brand New Link', 1)] };
      }
    });

    await user.click(await screen.findByRole('button', { name: 'Add link' }));
    const [addTitle] = screen.getAllByLabelText('Title');
    const [addUrl] = screen.getAllByLabelText('URL');
    await user.type(addTitle, 'Brand New Link');
    await user.type(addUrl, 'https://example.com/1');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(await screen.findByRole('link', { name: 'Brand New Link' })).toBeInTheDocument();
    expect(server.submitted).toEqual([
      {
        intent: 'createLink',
        projectId: 7,
        projectLinkAttributes: { title: 'Brand New Link', url: 'https://example.com/1', icon: '' },
      },
    ]);
    // the modal clears itself once the save has fully settled, just after the page reloads
    await waitFor(() => expect(addTitle).toHaveValue(''));
  });

  it('shows what the server says is wrong with a new link, and can be cancelled', async () => {
    const user = userEvent.setup();
    renderContentPage(buildProject(), () => data({ errors: ['Url must be a web address'] }, { status: 422 }));

    await user.click(await screen.findByRole('button', { name: 'Add link' }));
    // the modal fades in, so it only becomes accessible a moment after it opens
    await user.click(await screen.findByRole('button', { name: 'Add' }));

    expect(await screen.findByText(/Url must be a web address/)).toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: 'Cancel', hidden: true })[1]);
  });

  it('edits a link', async () => {
    const user = userEvent.setup();
    const server = renderContentPage(buildProject({ projectLinks: [link('Old Title', 1)] }), (body, state) => {
      if (body.intent === 'updateLink') {
        state.project = { ...state.project, projectLinks: [link('New Title', 1)] };
      }
    });

    await user.click(await screen.findByRole('button', { name: /Edit/ }));
    const editTitle = screen.getAllByLabelText('Title')[1];
    expect(editTitle).toHaveValue('Old Title');
    await user.clear(editTitle);
    await user.type(editTitle, 'New Title');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByRole('link', { name: 'New Title' })).toBeInTheDocument();
    expect(server.submitted).toEqual([
      {
        intent: 'updateLink',
        id: 1,
        projectLinkAttributes: { title: 'New Title', url: 'https://example.com/1', icon: 'link' },
      },
    ]);
  });

  it('deletes a link after confirmation', async () => {
    const user = userEvent.setup();
    const server = renderContentPage(
      buildProject({ projectLinks: [link('Doomed Link', 1), link('Safe Link', 2)] }),
      (body, state) => {
        if (body.intent === 'deleteLink') {
          state.project = {
            ...state.project,
            projectLinks: state.project.projectLinks.filter((l) => l.id !== body.id),
          };
        }
      },
    );

    await user.click((await screen.findAllByRole('button', { name: 'Delete link' }))[0]);
    expect(await screen.findByText('Are you sure you want to delete the “Doomed Link” link?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'OK', hidden: true }));

    await waitFor(() => expect(screen.queryByRole('link', { name: 'Doomed Link' })).not.toBeInTheDocument());
    expect(server.submitted).toEqual([{ intent: 'deleteLink', id: 1 }]);
    expect(screen.getByRole('link', { name: 'Safe Link' })).toBeInTheDocument();
  });
});

describe('project files', () => {
  beforeEach(() => {
    FakeXMLHttpRequest.reset();
    vi.stubGlobal('XMLHttpRequest', FakeXMLHttpRequest);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  const file = (filename: string, position: number) => buildFile({ id: position, filename, position, filesize: 1024 });

  it('lists the files in order', async () => {
    renderContentPage(buildProject({ projectFiles: [file('a.pdf', 1), file('b.pdf', 2)] }));

    await screen.findByRole('link', { name: /a\.pdf/ });
    const names = screen.getAllByRole('link', { name: /\.pdf/ }).map((a) => a.textContent?.trim());
    expect(names).toEqual(['a.pdf', 'b.pdf']);
  });

  it('deletes a file after confirmation', async () => {
    const user = userEvent.setup();
    const server = renderContentPage(
      buildProject({ projectFiles: [file('doomed.pdf', 1), file('safe.pdf', 2)] }),
      (body, state) => {
        if (body.intent === 'deleteFile') {
          state.project = {
            ...state.project,
            projectFiles: state.project.projectFiles.filter((f) => f.id !== body.id),
          };
        }
      },
    );

    await user.click(await screen.findByRole('button', { name: 'Delete file doomed.pdf' }));
    expect(await screen.findByText('Are you sure you want to delete doomed.pdf?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'OK', hidden: true }));

    await waitFor(() => expect(screen.queryByRole('link', { name: /doomed\.pdf/ })).not.toBeInTheDocument());
    expect(server.submitted).toEqual([{ intent: 'deleteFile', id: 1 }]);
    expect(screen.getByRole('link', { name: /safe\.pdf/ })).toBeInTheDocument();
  });

  it('hides the delete buttons from people who cannot delete files', async () => {
    renderContentPage(buildProject({ currentUserCanDeleteFiles: false, projectFiles: [file('a.pdf', 1)] }));

    await screen.findByRole('link', { name: /a\.pdf/ });
    expect(screen.queryByRole('button', { name: /Delete file/ })).not.toBeInTheDocument();
  });

  it('explains why uploads are unavailable without a license', async () => {
    renderContentPage(buildProject({ license: null }));

    expect(await screen.findByText(/Attaching files is disabled for this project/)).toBeInTheDocument();
    expect(screen.queryByLabelText('Upload files')).not.toBeInTheDocument();
  });

  it('does not offer uploads to people who cannot upload', async () => {
    renderContentPage(buildProject({ currentUserCanUploadFiles: false }));

    expect(await screen.findByText(/Attaching files is disabled/)).toBeInTheDocument();
  });

  /**
   * Answers the upload route as the server would: where to send a file, and (once it's been sent) recording it on the
   * project. Returns what was asked of it.
   */
  function serveUploads(server: FakeServer, { refuse }: { refuse?: 'request' | 'complete' } = {}) {
    const asked: Record<string, unknown>[] = [];
    mockFetch((url, init) => {
      expect(url.pathname).toEqual('/brands/acme/projects/7-the-big-larp/uploads');
      const body = JSON.parse(String(init?.body));
      asked.push(body);

      if (refuse === body.intent) {
        return {
          status: 422,
          body: { errors: ['Attaching files is only allowed for projects that specify a license'] },
        };
      }
      if (body.intent === 'request') {
        return {
          body: {
            upload: {
              uploadUrl: `https://storage.example.com/put/${body.filename}`,
              headers: { 'Content-Type': body.filetype ?? 'application/octet-stream' },
              key: `uploads/1-abc/${body.filename}`,
            },
          },
        };
      }
      const position = server.project.projectFiles.length + 1;
      server.project = {
        ...server.project,
        projectFiles: [...server.project.projectFiles, buildFile({ id: position, filename: body.filename, position })],
      };
      return { body: { done: true } };
    });
    return asked;
  }

  it('uploads a file straight to storage and then records it on the project', async () => {
    const user = userEvent.setup();
    const server = renderContentPage(buildProject());
    const asked = serveUploads(server);

    const upload = new File(['hello'], 'My File.pdf', { type: 'application/pdf' });
    await user.upload(await screen.findByLabelText('Upload files'), upload);

    expect(await screen.findByRole('link', { name: /My File\.pdf/ })).toBeInTheDocument();
    // it asked where to send the file, sent it there with the headers it was told to, and then said it was done
    expect(asked).toEqual([
      { intent: 'request', filename: 'My File.pdf', filetype: 'application/pdf' },
      { intent: 'complete', key: 'uploads/1-abc/My File.pdf', filename: 'My File.pdf', filetype: 'application/pdf' },
    ]);
    const [put] = FakeXMLHttpRequest.requests;
    expect(put).toMatchObject({
      method: 'PUT',
      url: 'https://storage.example.com/put/My File.pdf',
      headers: { 'Content-Type': 'application/pdf' },
      body: upload,
    });
    expect(screen.getByLabelText('Upload files')).not.toBeDisabled();
  });

  it('uploads several files one after another', async () => {
    const user = userEvent.setup();
    const server = renderContentPage(buildProject());
    const asked = serveUploads(server);

    await user.upload(await screen.findByLabelText('Upload files'), [
      new File(['1'], 'one.txt', { type: 'text/plain' }),
      new File(['2'], 'two.txt', { type: 'text/plain' }),
    ]);

    expect(await screen.findByRole('link', { name: /two\.txt/ })).toBeInTheDocument();
    expect(asked.map((body) => `${body.intent} ${body.filename}`)).toEqual([
      'request one.txt',
      'complete one.txt',
      'request two.txt',
      'complete two.txt',
    ]);
    expect(FakeXMLHttpRequest.requests.map((request) => request.url)).toEqual([
      'https://storage.example.com/put/one.txt',
      'https://storage.example.com/put/two.txt',
    ]);
  });

  it('shows upload progress', async () => {
    const user = userEvent.setup();
    // the PUT never finishes, so the page stays in its "uploading" state
    FakeXMLHttpRequest.autoRespond = false;
    const server = renderContentPage(buildProject());
    serveUploads(server);

    await user.upload(await screen.findByLabelText('Upload files'), new File(['x'], 'big.bin'));
    expect(await screen.findByText('Uploading big.bin...')).toBeInTheDocument();
    expect(screen.getByLabelText('Upload files')).toBeDisabled();

    await waitFor(() => expect(FakeXMLHttpRequest.requests).toHaveLength(1));
    act(() => FakeXMLHttpRequest.requests[0].progress(25, 100));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '25');
  });

  it('shows what went wrong when storage refuses the file, and lets you try again', async () => {
    const user = userEvent.setup();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    FakeXMLHttpRequest.status = 403;
    const server = renderContentPage(buildProject());
    const asked = serveUploads(server);

    await user.upload(await screen.findByLabelText('Upload files'), new File(['x'], 'nope.txt'));

    expect(await screen.findByText('Storage refused the file (403)')).toBeInTheDocument();
    expect(screen.getByLabelText('Upload files')).not.toBeDisabled();
    expect(within(screen.getByRole('progressbar')).getByText('0% Complete')).toBeInTheDocument();
    // the file never arrived, so the server was never told it was done
    expect(asked.map((body) => body.intent)).toEqual(['request']);
    consoleError.mockRestore();
  });

  it('shows what went wrong when the connection fails', async () => {
    const user = userEvent.setup();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    FakeXMLHttpRequest.autoRespond = false;
    const server = renderContentPage(buildProject());
    serveUploads(server);

    await user.upload(await screen.findByLabelText('Upload files'), new File(['x'], 'lost.txt'));
    await waitFor(() => expect(FakeXMLHttpRequest.requests).toHaveLength(1));
    act(() => FakeXMLHttpRequest.requests[0].failToConnect());

    expect(await screen.findByText(/The upload failed/)).toBeInTheDocument();
    expect(screen.getByLabelText('Upload files')).not.toBeDisabled();
    consoleError.mockRestore();
  });

  it.each(['request', 'complete'] as const)('shows what the server says when it refuses the %s step', async (step) => {
    const user = userEvent.setup();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const server = renderContentPage(buildProject());
    serveUploads(server, { refuse: step });

    await user.upload(await screen.findByLabelText('Upload files'), new File(['x'], 'refused.txt'));

    expect(
      await screen.findByText(/Attaching files is only allowed for projects that specify a license/),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Upload files')).not.toBeDisabled();
    consoleError.mockRestore();
  });
});

/**
 * dnd-kit works out where a dragged item can go from the on-screen positions of the sortable items, and jsdom has no
 * layout (every rect is all zeros).  Report the drag handles as a vertical stack of 50px rows, and give every other
 * element a nominal size (dnd-kit measures the floating drag overlay, among others, and a zero-size item can never
 * overlap the row it is being dragged to).
 */
function stubSortableLayout() {
  const realGetBoundingClientRect = Element.prototype.getBoundingClientRect;
  const rectAt = (top: number) => ({
    x: 0,
    y: top,
    width: 20,
    height: 50,
    top,
    left: 0,
    right: 20,
    bottom: top + 50,
    toJSON: () => ({}),
  });
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    const index = [...document.querySelectorAll('[aria-roledescription="sortable"]')].indexOf(this);
    return index !== -1 ? rectAt(index * 50) : rectAt(realGetBoundingClientRect.call(this).top);
  });
}

const sortableHandles = () => [...document.querySelectorAll<HTMLElement>('[aria-roledescription="sortable"]')];
const isDragging = () => document.querySelector('[style*="grabbing"]') != null;

describe('reordering by dragging', () => {
  beforeEach(() => {
    stubSortableLayout();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /** What the server does for a move: puts the item at its new place and renumbers the others */
  function applyMove<T extends { id: number; position: number | null }>(
    items: T[],
    id: number,
    destinationIndex: number,
  ) {
    const ordered = moveItem(
      items,
      items.findIndex((item) => item.id === id),
      destinationIndex,
    );
    return ordered.map((item, index) => ({ ...item, position: index + 1 }));
  }

  it('moves a link with the keyboard', async () => {
    const user = userEvent.setup();
    const link = (id: number, title: string) =>
      buildLink({ id, title, position: id, url: `https://example.com/${id}` });
    const server = renderContentPage(
      buildProject({ projectLinks: [link(1, 'First'), link(2, 'Second'), link(3, 'Third')] }),
      (body, state) => {
        if (body.intent === 'moveLink') {
          state.project = {
            ...state.project,
            projectLinks: applyMove(state.project.projectLinks, body.id, body.destinationIndex),
          };
        }
      },
    );

    await screen.findByRole('link', { name: 'First' });
    act(() => sortableHandles()[0].focus());
    await user.keyboard('[Space]');
    // while dragging, a preview of the dragged link floats along with the cursor
    await waitFor(() => expect(isDragging()).toBe(true));
    await user.keyboard('[ArrowDown]');

    await waitFor(() => expect(server.submitted).toEqual([{ intent: 'moveLink', id: 1, destinationIndex: 1 }]));
    await user.keyboard('[Space]');
    await waitFor(() => expect(isDragging()).toBe(false));
    await waitFor(() =>
      expect(screen.getAllByRole('link', { name: /First|Second|Third/ }).map((a) => a.textContent?.trim())).toEqual([
        'Second',
        'First',
        'Third',
      ]),
    );
  });

  it('moves nothing when a drag is cancelled', async () => {
    const user = userEvent.setup();
    const server = renderContentPage(
      buildProject({
        projectLinks: [
          buildLink({ id: 1, title: 'First', position: 1 }),
          buildLink({ id: 2, title: 'Second', position: 2 }),
        ],
      }),
    );

    await screen.findByRole('link', { name: 'First' });
    act(() => sortableHandles()[0].focus());
    await user.keyboard('[Space]');
    await waitFor(() => expect(isDragging()).toBe(true));
    await user.keyboard('[Escape]');

    await waitFor(() => expect(isDragging()).toBe(false));
    expect(server.submitted).toEqual([]);
    expect(screen.getAllByRole('link', { name: /First|Second/ }).map((a) => a.textContent?.trim())).toEqual([
      'First',
      'Second',
    ]);
  });

  it('moves a file with the keyboard', async () => {
    const user = userEvent.setup();
    const file = (id: number, filename: string) => buildFile({ id, filename, position: id, filesize: 1024 });
    const server = renderContentPage(
      buildProject({ projectFiles: [file(1, 'a.pdf'), file(2, 'b.pdf'), file(3, 'c.pdf')] }),
      (body, state) => {
        if (body.intent === 'moveFile') {
          state.project = {
            ...state.project,
            projectFiles: applyMove(state.project.projectFiles, body.id, body.destinationIndex),
          };
        }
      },
    );

    await screen.findByRole('link', { name: /a\.pdf/ });
    // the first file: down one place
    act(() => sortableHandles()[0].focus());
    await user.keyboard('[Space]');
    await waitFor(() => expect(isDragging()).toBe(true));
    await user.keyboard('[ArrowDown]');

    await waitFor(() => expect(server.submitted).toEqual([{ intent: 'moveFile', id: 1, destinationIndex: 1 }]));
    await user.keyboard('[Space]');
    await waitFor(() => expect(isDragging()).toBe(false));
    await waitFor(() =>
      expect(screen.getAllByRole('link', { name: /\.pdf/ }).map((a) => a.textContent?.trim())).toEqual([
        'b.pdf',
        'a.pdf',
        'c.pdf',
      ]),
    );
  });
});
