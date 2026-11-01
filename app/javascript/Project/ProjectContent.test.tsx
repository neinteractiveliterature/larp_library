import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as ProjectInitialContentPage from './ProjectInitialContentPage';
import {
  CompleteProjectFileUploadDocument,
  CreateProjectLinkDocument,
  DeleteProjectFileDocument,
  DeleteProjectLinkDocument,
  MoveProjectFileDocument,
  MoveProjectLinkDocument,
  UpdateProjectLinkDocument,
} from './mutations.generated';
import { ProjectPageQueryDocument } from './queries.generated';
import {
  buildLicense,
  buildProjectFields,
  buildProjectFile,
  buildProjectLink,
  resetFixtureIds,
} from '../../../test/javascript/fixtures';
import { MockedResponse, renderRouteModule } from '../../../test/javascript/testUtils';

// Replace only the AWS uploader, so no request ever leaves the test.  Each test controls what `done()` does.
const uploads: { params: Record<string, unknown>; handlers: Record<string, (progress: unknown) => void> }[] = [];
let uploadBehavior: () => Promise<unknown> = () => Promise.resolve({});
vi.mock('@aws-sdk/lib-storage', () => ({
  Upload: class {
    handlers: Record<string, (progress: unknown) => void> = {};
    constructor(options: { params: Record<string, unknown> }) {
      uploads.push({ params: options.params, handlers: this.handlers });
    }
    on(event: string, handler: (progress: unknown) => void) {
      this.handlers[event] = handler;
    }
    done() {
      return uploadBehavior();
    }
  },
}));

type Project = ReturnType<typeof buildProjectFields>;

const renderContentPage = (project: Project, extraMocks: MockedResponse[] = []) =>
  renderRouteModule(ProjectInitialContentPage, {
    route: '/brands/acme/projects/7-the-big-larp/initial_content',
    path: '/brands/:brandSlug/projects/:projectId/initial_content',
    mocks: [
      {
        request: { query: ProjectPageQueryDocument, variables: { projectId: '7-the-big-larp' } },
        result: { data: { project, licenses: [buildLicense()] } },
      },
      ...extraMocks,
    ],
  });

describe('project links', () => {
  beforeEach(() => resetFixtureIds());

  const link = (title: string, position: number, extra: Record<string, unknown> = {}) =>
    buildProjectLink({ id: `link-${position}`, title, position, url: `https://example.com/${position}`, ...extra });

  it('lists the links in order', async () => {
    renderContentPage(buildProjectFields({ projectLinks: [link('Second', 2), link('First', 1)] }));

    await screen.findByText('First');
    const titles = screen.getAllByRole('link', { name: /First|Second/ }).map((a) => a.textContent?.trim());
    expect(titles).toEqual(['First', 'Second']);
  });

  it('adds a link, then closes and clears the form', async () => {
    const user = userEvent.setup();
    let sent: unknown;
    renderContentPage(buildProjectFields(), [
      {
        request: { query: CreateProjectLinkDocument },
        variableMatcher: () => true,
        result: (variables: unknown) => {
          sent = variables;
          return {
            data: {
              createProjectLink: {
                __typename: 'CreateProjectLinkPayload',
                projectLink: link('Brand New Link', 1),
              },
            },
          };
        },
      },
    ]);

    await user.click(await screen.findByRole('button', { name: 'Add link' }));
    const [addTitle] = screen.getAllByLabelText('Title');
    const [addUrl] = screen.getAllByLabelText('URL');
    await user.type(addTitle, 'Brand New Link');
    await user.type(addUrl, 'https://example.com/1');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(await screen.findByRole('link', { name: 'Brand New Link' })).toBeInTheDocument();
    expect(sent).toEqual({
      projectId: '7',
      projectLinkAttributes: { title: 'Brand New Link', url: 'https://example.com/1', icon: '' },
    });
    expect(addTitle).toHaveValue('');
  });

  it('shows the error if adding fails, and can be cancelled', async () => {
    const user = userEvent.setup();
    renderContentPage(buildProjectFields(), [
      {
        request: { query: CreateProjectLinkDocument },
        variableMatcher: () => true,
        // the modal doesn't catch the failed mutation, so the browser logs an unhandled rejection as well
        error: new Error('[expected unhandled] url is invalid'),
      },
    ]);

    await user.click(await screen.findByRole('button', { name: 'Add link' }));
    // the modal fades in, so it only becomes accessible a moment after it opens
    await user.click(await screen.findByRole('button', { name: 'Add' }));

    expect(await screen.findByText(/url is invalid/)).toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: 'Cancel', hidden: true })[1]);
  });

  it('edits a link', async () => {
    const user = userEvent.setup();
    let sent: unknown;
    renderContentPage(buildProjectFields({ projectLinks: [link('Old Title', 1)] }), [
      {
        request: { query: UpdateProjectLinkDocument },
        variableMatcher: () => true,
        result: (variables: unknown) => {
          sent = variables;
          return {
            data: {
              updateProjectLink: { __typename: 'UpdateProjectLinkPayload', projectLink: link('New Title', 1) },
            },
          };
        },
      },
    ]);

    await user.click(await screen.findByRole('button', { name: /Edit/ }));
    const editTitle = screen.getAllByLabelText('Title')[1];
    expect(editTitle).toHaveValue('Old Title');
    await user.clear(editTitle);
    await user.type(editTitle, 'New Title');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(sent).toBeDefined());
    expect(sent).toEqual({
      id: 'link-1',
      projectLinkAttributes: { title: 'New Title', url: 'https://example.com/1', icon: 'bi-link' },
    });
    expect(await screen.findByRole('link', { name: 'New Title' })).toBeInTheDocument();
  });

  it('deletes a link after confirmation', async () => {
    const user = userEvent.setup();
    let deleted = false;
    renderContentPage(buildProjectFields({ projectLinks: [link('Doomed Link', 1), link('Safe Link', 2)] }), [
      {
        request: { query: DeleteProjectLinkDocument, variables: { id: 'link-1' } },
        result: () => {
          deleted = true;
          return { data: { deleteProjectLink: { __typename: 'DeleteProjectLinkPayload', clientMutationId: null } } };
        },
      },
    ]);

    await user.click((await screen.findAllByRole('button', { name: 'Delete link' }))[0]);
    expect(await screen.findByText('Are you sure you want to delete the “Doomed Link” link?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'OK', hidden: true }));

    await waitFor(() => expect(deleted).toBe(true));
    await waitFor(() => expect(screen.queryByRole('link', { name: 'Doomed Link' })).not.toBeInTheDocument());
    expect(screen.getByRole('link', { name: 'Safe Link' })).toBeInTheDocument();
  });
});

describe('project files', () => {
  beforeEach(() => {
    resetFixtureIds();
    uploads.length = 0;
    uploadBehavior = () => Promise.resolve({});
  });

  const file = (filename: string, position: number) =>
    buildProjectFile({ id: `file-${position}`, filename, position, filesize: 1024 });

  it('lists the files in order', async () => {
    renderContentPage(buildProjectFields({ projectFiles: [file('b.pdf', 2), file('a.pdf', 1)] }));

    await screen.findByRole('link', { name: /a\.pdf/ });
    const names = screen.getAllByRole('link', { name: /\.pdf/ }).map((a) => a.textContent?.trim());
    expect(names).toEqual(['a.pdf', 'b.pdf']);
  });

  it('deletes a file after confirmation', async () => {
    const user = userEvent.setup();
    let deleted = false;
    renderContentPage(buildProjectFields({ projectFiles: [file('doomed.pdf', 1), file('safe.pdf', 2)] }), [
      {
        request: { query: DeleteProjectFileDocument, variables: { id: 'file-1' } },
        result: () => {
          deleted = true;
          return { data: { deleteProjectFile: { __typename: 'DeleteProjectFilePayload', clientMutationId: null } } };
        },
      },
    ]);

    await user.click(await screen.findByRole('button', { name: 'Delete file doomed.pdf' }));
    expect(await screen.findByText('Are you sure you want to delete doomed.pdf?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'OK', hidden: true }));

    await waitFor(() => expect(deleted).toBe(true));
    await waitFor(() => expect(screen.queryByRole('link', { name: /doomed\.pdf/ })).not.toBeInTheDocument());
    expect(screen.getByRole('link', { name: /safe\.pdf/ })).toBeInTheDocument();
  });

  it('hides the delete buttons from people who cannot delete files', async () => {
    renderContentPage(buildProjectFields({ currentUserCanDeleteFiles: false, projectFiles: [file('a.pdf', 1)] }));

    await screen.findByRole('link', { name: /a\.pdf/ });
    expect(screen.queryByRole('button', { name: /Delete file/ })).not.toBeInTheDocument();
  });

  it('explains why uploads are unavailable without a license', async () => {
    renderContentPage(buildProjectFields({ license: null }));

    expect(await screen.findByText(/Attaching files is disabled for this project/)).toBeInTheDocument();
    expect(screen.queryByLabelText('Upload files')).not.toBeInTheDocument();
  });

  it('does not offer uploads to people who cannot upload', async () => {
    renderContentPage(buildProjectFields({ currentUserCanUploadFiles: false }));

    expect(await screen.findByText(/Attaching files is disabled/)).toBeInTheDocument();
  });

  it('uploads a file to S3 and then records it on the project', async () => {
    const user = userEvent.setup();
    let completed: Record<string, unknown> | undefined;
    renderContentPage(buildProjectFields(), [
      {
        request: { query: CompleteProjectFileUploadDocument },
        variableMatcher: () => true,
        result: (variables: Record<string, unknown>) => {
          completed = variables;
          return {
            data: {
              completeProjectFileUpload: {
                __typename: 'CompleteProjectFileUploadPayload',
                projectFile: buildProjectFile({ id: 'uploaded', filename: 'My File.pdf', position: 1 }),
              },
            },
          };
        },
      },
    ]);

    const upload = new File(['hello'], 'My File.pdf', { type: 'application/pdf' });
    await user.upload(await screen.findByLabelText('Upload files'), upload);

    expect(await screen.findByRole('link', { name: /My File\.pdf/ })).toBeInTheDocument();
    expect(uploads).toHaveLength(1);
    const key = uploads[0].params.Key as string;
    expect(key).toMatch(/^uploads\/\d+-[a-z0-9]+\/My_File\.pdf$/);
    expect(uploads[0].params).toMatchObject({
      Bucket: 'test-bucket',
      ContentType: 'application/pdf',
      ContentDisposition: 'attachment; filename="My File.pdf"',
    });
    expect(completed).toEqual({
      projectId: '7',
      url: `https://test-bucket.s3.amazonaws.com/${key}`,
      filename: 'My File.pdf',
      filetype: 'application/pdf',
      filesize: 5,
      filepath: key,
    });
    expect(screen.getByLabelText('Upload files')).not.toBeDisabled();
  });

  it('uploads several files one after another', async () => {
    const user = userEvent.setup();
    let completions = 0;
    renderContentPage(buildProjectFields(), [
      {
        request: { query: CompleteProjectFileUploadDocument },
        variableMatcher: () => true,
        maxUsageCount: 2,
        result: () => {
          completions += 1;
          return {
            data: {
              completeProjectFileUpload: {
                __typename: 'CompleteProjectFileUploadPayload',
                projectFile: buildProjectFile({
                  id: `uploaded-${completions}`,
                  filename: `f${completions}.txt`,
                  position: completions,
                }),
              },
            },
          };
        },
      },
    ]);

    await user.upload(await screen.findByLabelText('Upload files'), [
      new File(['1'], 'one.txt', { type: 'text/plain' }),
      new File(['2'], 'two.txt', { type: 'text/plain' }),
    ]);

    await waitFor(() => expect(completions).toBe(2));
    expect(uploads.map((u) => (u.params.Key as string).split('/').pop())).toEqual(['one.txt', 'two.txt']);
  });

  it('shows upload progress', async () => {
    const user = userEvent.setup();
    // never finishes, so the page stays in its "uploading" state
    uploadBehavior = () => new Promise(() => {});
    renderContentPage(buildProjectFields());

    await user.upload(await screen.findByLabelText('Upload files'), new File(['x'], 'big.bin'));
    expect(await screen.findByText('Uploading big.bin...')).toBeInTheDocument();
    expect(screen.getByLabelText('Upload files')).toBeDisabled();

    act(() => uploads[0].handlers['httpUploadProgress']({ loaded: 25, total: 100 }));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '25');
  });

  it('shows what went wrong when the upload fails, and lets you try again', async () => {
    const user = userEvent.setup();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    uploadBehavior = () => Promise.reject(new Error('Access Denied'));
    renderContentPage(buildProjectFields());

    await user.upload(await screen.findByLabelText('Upload files'), new File(['x'], 'nope.txt'));

    expect(await screen.findByText('Error: Access Denied')).toBeInTheDocument();
    expect(screen.getByLabelText('Upload files')).not.toBeDisabled();
    const bar = within(screen.getByRole('progressbar')).getByText('0% Complete');
    expect(bar).toBeInTheDocument();
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
    resetFixtureIds();
    stubSortableLayout();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('moves a link with the keyboard', async () => {
    const user = userEvent.setup();
    let moved: unknown;
    const reordered = [
      buildProjectLink({ id: 'link-2', title: 'Second', position: 1, url: 'https://example.com/2' }),
      buildProjectLink({ id: 'link-1', title: 'First', position: 2, url: 'https://example.com/1' }),
      buildProjectLink({ id: 'link-3', title: 'Third', position: 3, url: 'https://example.com/3' }),
    ];
    renderContentPage(
      buildProjectFields({
        projectLinks: [
          buildProjectLink({ id: 'link-1', title: 'First', position: 1, url: 'https://example.com/1' }),
          buildProjectLink({ id: 'link-2', title: 'Second', position: 2, url: 'https://example.com/2' }),
          buildProjectLink({ id: 'link-3', title: 'Third', position: 3, url: 'https://example.com/3' }),
        ],
      }),
      [
        {
          request: { query: MoveProjectLinkDocument },
          variableMatcher: (variables) => {
            moved = variables;
            return true;
          },
          result: {
            data: {
              moveProjectLink: {
                __typename: 'MoveProjectLinkPayload',
                project: buildProjectFields({ projectLinks: reordered }),
              },
            },
          },
        },
      ],
    );

    await screen.findByRole('link', { name: 'First' });
    act(() => sortableHandles()[0].focus());
    await user.keyboard('[Space]');
    // while dragging, a preview of the dragged link floats along with the cursor
    await waitFor(() => expect(isDragging()).toBe(true));
    await user.keyboard('[ArrowDown]');

    await waitFor(() => expect(moved).toEqual({ id: 'link-1', destinationIndex: 1 }));
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
    renderContentPage(
      buildProjectFields({
        projectLinks: [
          buildProjectLink({ id: 'link-1', title: 'First', position: 1 }),
          buildProjectLink({ id: 'link-2', title: 'Second', position: 2 }),
        ],
      }),
    );

    await screen.findByRole('link', { name: 'First' });
    act(() => sortableHandles()[0].focus());
    await user.keyboard('[Space]');
    await waitFor(() => expect(isDragging()).toBe(true));
    await user.keyboard('[Escape]');

    await waitFor(() => expect(isDragging()).toBe(false));
    expect(screen.getAllByRole('link', { name: /First|Second/ }).map((a) => a.textContent?.trim())).toEqual([
      'First',
      'Second',
    ]);
  });

  it('moves a file with the keyboard', async () => {
    const user = userEvent.setup();
    let moved: unknown;
    const file = (id: string, filename: string, position: number) =>
      buildProjectFile({ id, filename, position, filesize: 1024 });
    renderContentPage(
      buildProjectFields({
        projectFiles: [file('file-1', 'a.pdf', 1), file('file-2', 'b.pdf', 2), file('file-3', 'c.pdf', 3)],
      }),
      [
        {
          request: { query: MoveProjectFileDocument },
          variableMatcher: (variables) => {
            moved = variables;
            return true;
          },
          result: {
            data: {
              moveProjectFile: {
                __typename: 'MoveProjectFilePayload',
                project: buildProjectFields({
                  projectFiles: [file('file-2', 'b.pdf', 1), file('file-1', 'a.pdf', 2), file('file-3', 'c.pdf', 3)],
                }),
              },
            },
          },
        },
      ],
    );

    await screen.findByRole('link', { name: /a\.pdf/ });
    // the first file: down one place
    act(() => sortableHandles()[0].focus());
    await user.keyboard('[Space]');
    await waitFor(() => expect(isDragging()).toBe(true));
    await user.keyboard('[ArrowDown]');

    await waitFor(() => expect(moved).toEqual({ id: 'file-1', destinationIndex: 1 }));
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
