import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BrandListPage from './BrandListPage';
import type { BrandCardData, BrandListPageData } from '../server/lib/brands.server';
import { recordingLoader, renderRouteModule, withRouteErrorDisplay } from '../../../test/javascript/testUtils';

vi.mock('../Waypoint', () => import('../../../test/javascript/mockWaypoint'));

let nextId = 1;
function buildBrandCard(overrides: Partial<BrandCardData> = {}): BrandCardData {
  const id = nextId++;
  return { id, name: `Brand ${id}`, slug: `brand-${id}`, description: null, projectCount: 3, ...overrides };
}

function page(brands: BrandCardData[], { totalCount = brands.length, offset = 0 } = {}): BrandListPageData {
  return { brands, totalCount, offset };
}

describe('BrandListPage', () => {
  beforeEach(() => {
    nextId = 1;
  });

  it('lists the brands with their larp counts', async () => {
    const { loader } = recordingLoader(() =>
      page([
        buildBrandCard({
          name: 'Team No Pants',
          slug: 'team-no-pants',
          projectCount: 4,
          description: 'We **do** larps',
        }),
        buildBrandCard({ name: 'Solo Act', projectCount: 1 }),
      ]),
    );
    renderRouteModule({ default: BrandListPage, loader });

    expect(await screen.findByRole('heading', { name: 'Larp creators' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Team No Pants' })).toHaveAttribute('href', '/brands/team-no-pants');
    expect(screen.getByText('(4 larps)')).toBeInTheDocument();
    expect(screen.getByText('(1 larp)')).toBeInTheDocument();
    expect(screen.getByText('do').tagName).toEqual('STRONG');
  });

  it('truncates long descriptions with a read more link', async () => {
    const { loader } = recordingLoader(() =>
      page([buildBrandCard({ name: 'Wordy', slug: 'wordy', description: 'x'.repeat(500) })]),
    );
    renderRouteModule({ default: BrandListPage, loader });

    expect(await screen.findByRole('link', { name: '... (read more)' })).toHaveAttribute('href', '/brands/wordy');
  });

  it('shows an error if the brands cannot be loaded', async () => {
    renderRouteModule(
      withRouteErrorDisplay({
        default: BrandListPage,
        loader: () => {
          throw new Error('boom');
        },
      }),
    );

    expect(await screen.findByText(/boom/)).toBeInTheDocument();
  });

  it('loads more brands, by offset, when scrolled to the end', async () => {
    const user = userEvent.setup();
    const first = Array.from({ length: 5 }, (_, i) => buildBrandCard({ name: `Early ${i + 1}` }));
    const { loader, requests } = recordingLoader((url) =>
      url.searchParams.get('offset') === '5'
        ? page([buildBrandCard({ name: 'Late Brand' })], { totalCount: 6, offset: 5 })
        : page(first, { totalCount: 6 }),
    );
    renderRouteModule({ default: BrandListPage, loader });

    await screen.findByText('Early 1');
    expect(screen.queryByText('Late Brand')).not.toBeInTheDocument();
    await user.click(screen.getByTestId('waypoint'));

    expect(await screen.findByText('Late Brand')).toBeInTheDocument();
    expect(screen.getByText('Early 5')).toBeInTheDocument();
    expect(requests.some((url) => url.searchParams.get('offset') === '5')).toBe(true);
  });

  it('does not load more when everything is already loaded', async () => {
    const user = userEvent.setup();
    const { loader, requests } = recordingLoader(() =>
      page(Array.from({ length: 5 }, (_, i) => buildBrandCard({ name: `Complete ${i + 1}` }))),
    );
    renderRouteModule({ default: BrandListPage, loader });

    await screen.findByText('Complete 1');
    await user.click(screen.getByTestId('waypoint'));

    expect(screen.getAllByText(/^Complete/)).toHaveLength(5);
    expect(requests).toHaveLength(1);
  });
});
