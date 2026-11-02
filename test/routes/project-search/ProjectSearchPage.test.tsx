import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ProjectSearchPage from '~/routes/project-search/ProjectSearchPage';
import type { ProjectSearchResult } from '~/server/lib/projectSearch.server';
import type { TagData } from '~/lib/projectData';
import { renderRouteModule, withRouteErrorDisplay } from '../../testUtils';

vi.mock('~/components/Waypoint', () => import('../../mockWaypoint'));

let nextId = 1;

function buildResult(title: string, overrides: Partial<ProjectSearchResult> = {}): ProjectSearchResult {
  const id = nextId++;
  return {
    id,
    title,
    authors: null,
    minPlayers: null,
    maxPlayers: null,
    minFacilitators: null,
    maxFacilitators: null,
    publicationYear: null,
    lengthQuantity: null,
    lengthUnits: null,
    brand: { id: 1, name: 'Cool Games', slug: 'cool-games' },
    tags: [],
    description: 'A **fun** larp.',
    ...overrides,
  };
}

type LoaderData = { projects: ProjectSearchResult[]; totalCount: number; offset: number; tag: TagData | null };

/** A stand-in for the route's loader: it's handed the URL it was asked for, and answers with whatever the test decides */
function fakeLoader(answer: (url: URL) => Partial<LoaderData>) {
  const requests: URL[] = [];
  const loader = ({ request }: { request: Request }): LoaderData => {
    const url = new URL(request.url);
    requests.push(url);
    const partial = answer(url);
    const projects = partial.projects ?? [];
    return { projects, totalCount: projects.length, offset: 0, tag: null, ...partial };
  };
  return { loader, requests };
}

function renderSearchPage(route: string, loader: ReturnType<typeof fakeLoader>['loader']) {
  return renderRouteModule({ ...ProjectSearchPage, default: ProjectSearchPage, loader }, { route, path: '/projects' });
}

describe('ProjectSearchPage', () => {
  beforeEach(() => {
    nextId = 1;
  });

  it('lists the matching projects', async () => {
    const { loader } = fakeLoader(() => ({ projects: [buildResult('First Larp'), buildResult('Second Larp')] }));
    renderSearchPage('/projects', loader);

    expect(await screen.findByRole('heading', { name: 'Larps' })).toBeInTheDocument();
    expect(await screen.findByText('First Larp')).toBeInTheDocument();
    expect(screen.getByText('Second Larp')).toBeInTheDocument();
    // descriptions are rendered as markdown
    expect(screen.getAllByText('fun')[0].tagName).toEqual('STRONG');
  });

  it('shows an error when the search fails', async () => {
    renderRouteModule(
      withRouteErrorDisplay({
        default: ProjectSearchPage,
        loader: () => {
          throw new Error('boom');
        },
      }),
      { route: '/projects' },
    );

    expect(await screen.findByText(/boom/)).toBeInTheDocument();
  });

  it('puts the typed search in the URL and sends it to the loader', async () => {
    const user = userEvent.setup();
    // Typing is debounced, but a slow machine can pause long enough mid-word to send a partial search (e.g. "wo"), so any
    // search gets the same answer rather than only the finished word.
    const { loader, requests } = fakeLoader((url) => ({
      projects: [buildResult(url.searchParams.get('q') ? 'Just Wolves' : 'Everything')],
    }));
    renderSearchPage('/projects', loader);

    await screen.findByText('Everything');
    await user.type(screen.getByRole('searchbox'), 'wolf');

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/projects?q=wolf'));
    expect(await screen.findByText('Just Wolves')).toBeInTheDocument();
    expect(requests.map((url) => url.searchParams.get('q'))).toContain('wolf');
  });

  it('shows the filtered tag and removes it when dismissed', async () => {
    const user = userEvent.setup();
    const horde: TagData = { id: 5, name: 'horde', tagCategory: null };
    const { loader } = fakeLoader((url) =>
      url.searchParams.get('tag')
        ? { projects: [buildResult('Hordey')], tag: horde }
        : { projects: [buildResult('Anything')] },
    );
    renderSearchPage('/projects?tag=horde', loader);

    await screen.findByText('Hordey');
    await user.click(screen.getByRole('button', { name: 'Remove horde' }));

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent(/^\/projects\??$/));
    expect(await screen.findByText('Anything')).toBeInTheDocument();
  });

  it('switches to advanced search, which opens automatically when advanced params are in the URL', async () => {
    const user = userEvent.setup();
    const { loader } = fakeLoader(() => ({ projects: [buildResult('Wolf Larp')] }));
    renderSearchPage('/projects?title=Wolf&player_count_lower=4', loader);

    expect(await screen.findByText('Advanced search')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toHaveValue('Wolf');
    expect(screen.getByLabelText('Supports between')).toHaveValue(4);

    await user.click(screen.getByRole('button', { name: 'Switch to simple search' }));
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent(/^\/projects\??$/));
    expect(screen.queryByText('Advanced search')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Switch to advanced search' })).toBeInTheDocument();
  });

  it('lets you fill in each advanced search field', { timeout: 30000 }, async () => {
    const user = userEvent.setup();
    const { loader } = fakeLoader(() => ({ projects: [buildResult('Anything')] }));
    renderSearchPage('/projects', loader);

    await screen.findByText('Anything');
    await user.click(screen.getByRole('button', { name: 'Switch to advanced search' }));
    // each field is debounced and merges into the URL, so let one land before typing in the next
    const typeAndWaitForUrl = async (label: string | RegExp, text: string, urlFragment: string, index = 0) => {
      await user.type(screen.getAllByLabelText(label)[index], text);
      await waitFor(() => expect(screen.getByTestId('location').textContent).toContain(urlFragment));
    };

    await typeAndWaitForUrl('Search (all fields)', 'x', 'q=x');
    await typeAndWaitForUrl('Title', 'y', 'title=y');
    await typeAndWaitForUrl('Author(s)', 'z', 'authors=z');
    await typeAndWaitForUrl('Supports between', '3', 'player_count_lower=3');
    await typeAndWaitForUrl('and', '9', 'player_count_upper=9', 0);
    await typeAndWaitForUrl('Requires between', '1', 'facilitator_count_lower=1');
    await typeAndWaitForUrl('and', '2', 'facilitator_count_upper=2', 1);
  });

  it('loads the next page, by offset, when the end of the list scrolls into view', async () => {
    const user = userEvent.setup();
    const firstPage = Array.from({ length: 5 }, (_, i) => buildResult(`Page One Larp ${i + 1}`));
    const secondPage = [buildResult('Page Two Larp')];
    const { loader, requests } = fakeLoader((url) =>
      url.searchParams.get('offset') === '5'
        ? { projects: secondPage, totalCount: 6, offset: 5 }
        : { projects: firstPage, totalCount: 6, offset: 0 },
    );
    renderSearchPage('/projects?q=larp', loader);

    await screen.findByText('Page One Larp 1');
    expect(screen.queryByText('Page Two Larp')).not.toBeInTheDocument();
    await user.click(screen.getByTestId('waypoint'));

    expect(await screen.findByText('Page Two Larp')).toBeInTheDocument();
    expect(screen.getByText('Page One Larp 5')).toBeInTheDocument();
    // the next page is the same search, from where the first page ended
    const nextRequest = requests.find((url) => url.searchParams.get('offset') === '5');
    expect(nextRequest?.searchParams.get('q')).toEqual('larp');
  });

  it('drops the pages it loaded when the search changes', async () => {
    const user = userEvent.setup();
    const firstPage = Array.from({ length: 5 }, (_, i) => buildResult(`Old Larp ${i + 1}`));
    const { loader } = fakeLoader((url) => {
      if (url.searchParams.get('q')) {
        return { projects: [buildResult('New Result')] };
      }
      return url.searchParams.get('offset') === '5'
        ? { projects: [buildResult('Old Page Two')], totalCount: 6, offset: 5 }
        : { projects: firstPage, totalCount: 6, offset: 0 };
    });
    renderSearchPage('/projects', loader);

    await screen.findByText('Old Larp 1');
    await user.click(screen.getByTestId('waypoint'));
    await screen.findByText('Old Page Two');

    await user.type(screen.getByRole('searchbox'), 'new');

    expect(await screen.findByText('New Result')).toBeInTheDocument();
    expect(screen.queryByText('Old Page Two')).not.toBeInTheDocument();
    expect(screen.queryByText('Old Larp 1')).not.toBeInTheDocument();
  });

  it('does not request more when everything is already loaded', async () => {
    const user = userEvent.setup();
    const { loader, requests } = fakeLoader(() => ({
      projects: Array.from({ length: 5 }, (_, i) => buildResult(`Only Larp ${i + 1}`)),
    }));
    renderSearchPage('/projects', loader);

    await screen.findByText('Only Larp 1');
    await user.click(screen.getByTestId('waypoint'));
    expect(screen.getAllByText(/^Only Larp/)).toHaveLength(5);
    expect(requests).toHaveLength(1);
  });
});
