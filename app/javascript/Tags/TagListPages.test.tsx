import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as TagListPage from './TagListPage';
import { TagListPageQueryDocument } from './queries.generated';
import * as TagCategoryListPage from '../TagCategories/TagCategoryListPage';
import { TagCategoryListPageQueryDocument } from '../TagCategories/queries.generated';
import { buildConnection, buildTag, buildTagCategory, resetFixtureIds } from '../../../test/javascript/fixtures';
import RouteErrorDisplay from '../RouteErrorDisplay';
import { MockedResponse, renderRouteModule } from '../../../test/javascript/testUtils';

vi.mock('../Waypoint', () => import('../../../test/javascript/mockWaypoint'));

function pagedMock(
  query: MockedResponse['request']['query'],
  field: string,
  nodes: { id: string }[],
  { totalCount = nodes.length, after }: { totalCount?: number; after?: string } = {},
): MockedResponse {
  return {
    request: { query },
    variableMatcher: (variables) => (after ? variables.after === after : variables.after == null),
    result: { data: { [field]: buildConnection(nodes, { totalCount }) } },
  };
}

describe('TagListPage', () => {
  beforeEach(() => resetFixtureIds());

  it('links each tag to its edit page, and offers to create a new one', async () => {
    const tag = buildTag({ id: '77', name: 'horde' });
    renderRouteModule(TagListPage, { mocks: [pagedMock(TagListPageQueryDocument, 'tags', [tag])] });

    expect(await screen.findByRole('link', { name: 'horde' })).toHaveAttribute('href', '/tags/77/edit');
    expect(screen.getAllByRole('link', { name: 'New tag' })).toHaveLength(2);
  });

  it('shows the error instead of the page if the first page of tags fails to load', async () => {
    renderRouteModule(
      { ...TagListPage, ErrorBoundary: ({ error }: { error: unknown }) => <RouteErrorDisplay error={error} /> },
      {
        mocks: [
          {
            request: { query: TagListPageQueryDocument },
            variableMatcher: () => true,
            error: new Error('tags are unavailable'),
          },
        ],
      },
    );

    expect(await screen.findByText(/tags are unavailable/)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Tags' })).not.toBeInTheDocument();
  });

  it('pages in more tags when scrolled to the end', async () => {
    const user = userEvent.setup();
    const firstPage = Array.from({ length: 5 }, (_, i) => buildTag({ name: `first-${i + 1}` }));
    renderRouteModule(TagListPage, {
      mocks: [
        pagedMock(TagListPageQueryDocument, 'tags', firstPage, { totalCount: 6 }),
        pagedMock(TagListPageQueryDocument, 'tags', [buildTag({ name: 'second-page-tag' })], {
          totalCount: 6,
          after: `cursor-${firstPage[4].id}`,
        }),
      ],
    });

    await screen.findByText('first-1');
    await user.click(screen.getByTestId('waypoint'));
    expect(await screen.findByText('second-page-tag')).toBeInTheDocument();
  });

  it('does not page when all tags are loaded', async () => {
    const user = userEvent.setup();
    const tags = Array.from({ length: 5 }, (_, i) => buildTag({ name: `only-${i + 1}` }));
    renderRouteModule(TagListPage, { mocks: [pagedMock(TagListPageQueryDocument, 'tags', tags)] });

    await screen.findByText('only-1');
    await user.click(screen.getByTestId('waypoint'));
    expect(screen.getAllByText(/^only-/)).toHaveLength(5);
  });
});

describe('TagCategoryListPage', () => {
  beforeEach(() => resetFixtureIds());

  it('links each category to its edit page', async () => {
    const category = buildTagCategory({ id: '9', name: 'Genre' });
    renderRouteModule(TagCategoryListPage, {
      mocks: [pagedMock(TagCategoryListPageQueryDocument, 'tagCategories', [category])],
    });

    expect(await screen.findByRole('link', { name: 'Genre' })).toHaveAttribute('href', '/tag_categories/9/edit');
    expect(screen.getAllByRole('link', { name: 'New tag category' })).toHaveLength(2);
  });

  it('pages in more categories when scrolled to the end', async () => {
    const user = userEvent.setup();
    const firstPage = Array.from({ length: 5 }, (_, i) => buildTagCategory({ name: `Cat ${i + 1}` }));
    renderRouteModule(TagCategoryListPage, {
      mocks: [
        pagedMock(TagCategoryListPageQueryDocument, 'tagCategories', firstPage, { totalCount: 6 }),
        pagedMock(TagCategoryListPageQueryDocument, 'tagCategories', [buildTagCategory({ name: 'Cat Six' })], {
          totalCount: 6,
          after: `cursor-${firstPage[4].id}`,
        }),
      ],
    });

    await screen.findByText('Cat 1');
    await user.click(screen.getByTestId('waypoint'));
    expect(await screen.findByText('Cat Six')).toBeInTheDocument();
  });

  it('does not page when all categories are loaded', async () => {
    const user = userEvent.setup();
    const categories = Array.from({ length: 5 }, (_, i) => buildTagCategory({ name: `Solo ${i + 1}` }));
    renderRouteModule(TagCategoryListPage, {
      mocks: [pagedMock(TagCategoryListPageQueryDocument, 'tagCategories', categories)],
    });

    await screen.findByText('Solo 1');
    await user.click(screen.getByTestId('waypoint'));
    expect(screen.getAllByText(/^Solo /)).toHaveLength(5);
  });
});
