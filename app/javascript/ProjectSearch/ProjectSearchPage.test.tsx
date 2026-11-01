import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as ProjectSearchPage from './ProjectSearchPage';
import { ProjectSearchQueryDocument } from './queries.generated';
import { buildConnection, buildProjectHeaders, buildTag, resetFixtureIds } from '../../../test/javascript/fixtures';
import { MockedResponse, renderRouteModule, withRouteErrorDisplay } from '../../../test/javascript/testUtils';

vi.mock('../Waypoint', () => import('../../../test/javascript/mockWaypoint'));

function buildProject(overrides: Record<string, unknown> = {}) {
  return { ...buildProjectHeaders(), description: 'A **fun** larp.', ...overrides };
}

function searchMock(
  projects: ReturnType<typeof buildProject>[],
  {
    totalCount = projects.length,
    tagByName = null as ReturnType<typeof buildTag> | null,
    matchVariables = (() => true) as (variables: Record<string, unknown>) => boolean,
  } = {},
): MockedResponse {
  return {
    request: { query: ProjectSearchQueryDocument },
    variableMatcher: matchVariables,
    result: { data: { projects: buildConnection(projects, { totalCount }), tagByName } },
  };
}

describe('ProjectSearchPage', () => {
  beforeEach(() => resetFixtureIds());

  it('lists the matching projects', async () => {
    renderRouteModule(ProjectSearchPage, {
      route: '/projects',
      mocks: [searchMock([buildProject({ title: 'First Larp' }), buildProject({ title: 'Second Larp' })])],
    });

    expect(await screen.findByRole('heading', { name: 'Larps' })).toBeInTheDocument();
    expect(await screen.findByText('First Larp')).toBeInTheDocument();
    expect(screen.getByText('Second Larp')).toBeInTheDocument();
    // descriptions are rendered as markdown
    expect(screen.getAllByText('fun')[0].tagName).toEqual('STRONG');
  });

  it('shows an error when the search fails', async () => {
    renderRouteModule(withRouteErrorDisplay(ProjectSearchPage), {
      route: '/projects',
      mocks: [
        { request: { query: ProjectSearchQueryDocument }, variableMatcher: () => true, error: new Error('boom') },
      ],
    });

    expect(await screen.findByText(/boom/)).toBeInTheDocument();
  });

  it('puts the typed search in the URL and sends it to the API', async () => {
    const user = userEvent.setup();
    const seenQueryStrings: unknown[] = [];
    // Typing is debounced, but a slow machine can pause long enough mid-word to send a partial search (e.g. "wo"), so
    // every non-empty search gets the same answer rather than only the finished word.
    const answerFor = (title: string, applies: (queryString: unknown) => boolean) => ({
      ...searchMock([buildProject({ title })], {
        matchVariables: (variables) => {
          seenQueryStrings.push(variables.queryString);
          return applies(variables.queryString);
        },
      }),
      maxUsageCount: Number.POSITIVE_INFINITY,
    });
    renderRouteModule(ProjectSearchPage, {
      route: '/projects',
      mocks: [
        answerFor('Everything', (queryString) => queryString == null),
        answerFor('Just Wolves', (queryString) => typeof queryString === 'string' && queryString !== ''),
      ],
    });

    await screen.findByText('Everything');
    await user.type(screen.getByRole('searchbox'), 'wolf');

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/projects?q=wolf'));
    expect(await screen.findByText('Just Wolves')).toBeInTheDocument();
    expect(seenQueryStrings).toContain('wolf');
  });

  it('shows the filtered tag and removes it when dismissed', async () => {
    const user = userEvent.setup();
    const horde = buildTag({ name: 'horde' });
    renderRouteModule(ProjectSearchPage, {
      route: '/projects?tag=horde',
      mocks: [
        searchMock([buildProject({ title: 'Hordey' })], { tagByName: horde }),
        searchMock([buildProject({ title: 'Anything' })]),
      ],
    });

    await screen.findByText('Hordey');
    await user.click(screen.getByRole('button', { name: 'Remove horde' }));

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent(/^\/projects\??$/));
  });

  it('switches to advanced search, which opens automatically when advanced params are in the URL', async () => {
    const user = userEvent.setup();
    renderRouteModule(ProjectSearchPage, {
      route: '/projects?title=Wolf&player_count_lower=4',
      mocks: [searchMock([buildProject({ title: 'Wolf Larp' })]), searchMock([buildProject({ title: 'Wolf Larp' })])],
    });

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
    renderRouteModule(ProjectSearchPage, {
      route: '/projects',
      // every field that lands in the URL is a new search, answered by the same mock
      mocks: [{ ...searchMock([buildProject({ title: 'Anything' })]), maxUsageCount: Number.POSITIVE_INFINITY }],
    });

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

  it('loads the next page when the end of the list scrolls into view', async () => {
    const user = userEvent.setup();
    const firstPage = Array.from({ length: 5 }, (_, i) => buildProject({ title: `Page One Larp ${i + 1}` }));
    const secondPage = [buildProject({ title: 'Page Two Larp' })];
    renderRouteModule(ProjectSearchPage, {
      route: '/projects',
      mocks: [
        searchMock(firstPage, { totalCount: 6 }),
        searchMock(secondPage, {
          totalCount: 6,
          matchVariables: (variables) => variables.after === `cursor-${firstPage[4].id}`,
        }),
      ],
    });

    await screen.findByText('Page One Larp 1');
    expect(screen.queryByText('Page Two Larp')).not.toBeInTheDocument();
    await user.click(screen.getByTestId('waypoint'));

    expect(await screen.findByText('Page Two Larp')).toBeInTheDocument();
    expect(within(document.body).getByText('Page One Larp 5')).toBeInTheDocument();
  });

  it('does not request more when everything is already loaded', async () => {
    const user = userEvent.setup();
    const projects = Array.from({ length: 5 }, (_, i) => buildProject({ title: `Only Larp ${i + 1}` }));
    renderRouteModule(ProjectSearchPage, { route: '/projects', mocks: [searchMock(projects, { totalCount: 5 })] });

    await screen.findByText('Only Larp 1');
    await user.click(screen.getByTestId('waypoint'));
    expect(screen.getAllByText(/^Only Larp/)).toHaveLength(5);
  });
});
