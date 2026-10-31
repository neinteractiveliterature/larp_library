import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BrandListPage from './BrandListPage';
import { BrandsPageQueryDocument } from './queries.generated';
import { buildBrand, buildConnection, resetFixtureIds } from '../../../test/javascript/fixtures';
import { MockedResponse, renderPage } from '../../../test/javascript/testUtils';

vi.mock('../Waypoint', () => import('../../../test/javascript/mockWaypoint'));

function brandWithProjects(overrides: Record<string, unknown> = {}, projectCount = 3) {
  return { ...buildBrand(overrides), projects: { __typename: 'Connection', totalCount: projectCount } };
}

function brandsMock(
  brands: ReturnType<typeof brandWithProjects>[],
  { totalCount = brands.length, after }: { totalCount?: number; after?: string } = {},
): MockedResponse {
  return {
    request: { query: BrandsPageQueryDocument },
    variableMatcher: (variables) => (after ? variables.after === after : variables.after == null),
    result: { data: { brands: buildConnection(brands, { totalCount }) } },
  };
}

describe('BrandListPage', () => {
  beforeEach(() => resetFixtureIds());

  it('lists the brands with their larp counts', async () => {
    renderPage(<BrandListPage />, {
      mocks: [
        brandsMock([
          brandWithProjects({ name: 'Team No Pants', slug: 'team-no-pants' }, 1),
          brandWithProjects({ name: 'Alleged Entertainment', slug: 'alleged' }, 5),
        ]),
      ],
    });

    expect(await screen.findByRole('heading', { name: 'Larp creators' })).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: 'Team No Pants' })).toHaveAttribute('href', '/brands/team-no-pants');
    expect(screen.getByText('(1 larp)')).toBeInTheDocument();
    expect(screen.getByText('(5 larps)')).toBeInTheDocument();
  });

  it('truncates long descriptions with a read more link', async () => {
    renderPage(<BrandListPage />, {
      mocks: [
        brandsMock([
          brandWithProjects({ name: 'Wordy', slug: 'wordy', description: 'word '.repeat(200) }),
          brandWithProjects({ name: 'Terse', slug: 'terse', description: 'short and sweet' }),
          brandWithProjects({ name: 'Blank', slug: 'blank', description: null }),
        ]),
      ],
    });

    expect(await screen.findByText('short and sweet')).toBeInTheDocument();
    const readMore = screen.getByRole('link', { name: '... (read more)' });
    expect(readMore).toHaveAttribute('href', '/brands/wordy');
    expect(screen.getAllByText(/^word word/)[0].textContent!.length).toBeLessThan(560);
  });

  it('shows an error if the brands cannot be loaded', async () => {
    renderPage(<BrandListPage />, {
      mocks: [{ request: { query: BrandsPageQueryDocument }, variableMatcher: () => true, error: new Error('nope') }],
    });

    expect(await screen.findByText(/nope/)).toBeInTheDocument();
  });

  it('loads more brands when scrolled to the end', async () => {
    const user = userEvent.setup();
    const firstPage = Array.from({ length: 5 }, (_, i) => brandWithProjects({ name: `First Page Brand ${i + 1}` }));
    renderPage(<BrandListPage />, {
      mocks: [
        brandsMock(firstPage, { totalCount: 6 }),
        brandsMock([brandWithProjects({ name: 'Second Page Brand' })], {
          totalCount: 6,
          after: `cursor-${firstPage[4].id}`,
        }),
      ],
    });

    await screen.findByText('First Page Brand 1');
    await user.click(screen.getByTestId('waypoint'));
    expect(await screen.findByText('Second Page Brand')).toBeInTheDocument();
  });

  it('does not load more when everything is already loaded', async () => {
    const user = userEvent.setup();
    const brands = Array.from({ length: 5 }, (_, i) => brandWithProjects({ name: `Brand Number ${i + 1}` }));
    renderPage(<BrandListPage />, { mocks: [brandsMock(brands, { totalCount: 5 })] });

    await screen.findByText('Brand Number 1');
    await user.click(screen.getByTestId('waypoint'));
    expect(screen.getAllByText(/^Brand Number/)).toHaveLength(5);
  });
});
