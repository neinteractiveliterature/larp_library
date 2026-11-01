import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { data } from 'react-router';

import BrandPage from './BrandPage';
import UnapprovedBrandAlert from './UnapprovedBrandAlert';
import UnapprovedBrandsListPage from './UnapprovedBrandsListPage';
import type { BrandPageData, UnapprovedBrandData } from '../server/lib/brands.server';
import type { ProjectCardData } from '../server/lib/projectHeaders.server';
import {
  recordingLoader,
  renderPage,
  renderRouteModule,
  withRouteErrorDisplay,
} from '../../../test/javascript/testUtils';

vi.mock('../Waypoint', () => import('../../../test/javascript/mockWaypoint'));

let nextId = 1;

function buildProject(title: string): ProjectCardData {
  return {
    id: nextId++,
    title,
    authors: null,
    minPlayers: null,
    maxPlayers: null,
    minFacilitators: null,
    maxFacilitators: null,
    publicationYear: null,
    lengthQuantity: null,
    lengthUnits: null,
    brand: { id: 1, name: 'Team No Pants', slug: 'team-no-pants' },
    tags: [],
    description: 'A larp description',
  };
}

function brandPage(
  projects: ProjectCardData[],
  brand: Partial<BrandPageData['brand']> = {},
  { totalCount = projects.length, offset = 0 } = {},
): BrandPageData {
  return {
    brand: {
      id: 1,
      name: 'Team No Pants',
      slug: 'team-no-pants',
      description: null,
      approved: true,
      currentUserCanEdit: false,
      currentUserCanCreateProjects: false,
      ...brand,
    },
    projects,
    totalCount,
    offset,
  };
}

describe('BrandPage', () => {
  beforeEach(() => {
    nextId = 1;
  });

  const renderBrandPage = (loader: ReturnType<typeof recordingLoader<BrandPageData>>['loader']) =>
    renderRouteModule(withRouteErrorDisplay({ default: BrandPage, loader }), {
      route: '/brands/team-no-pants',
      path: '/brands/:brandSlug',
    });

  it('shows the brand, its description and its projects', async () => {
    const { loader } = recordingLoader(() =>
      brandPage([buildProject('Pantsless Larp')], { description: 'We make **bold** games.' }),
    );
    renderBrandPage(loader);

    expect(await screen.findByRole('heading', { name: 'Team No Pants' })).toBeInTheDocument();
    expect(screen.getByText('bold').tagName).toEqual('STRONG');
    expect(screen.getByText('Pantsless Larp')).toBeInTheDocument();
    // without permissions there are no admin controls
    expect(screen.queryByRole('link', { name: 'New project' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
    expect(screen.queryByText(/pending approval/)).not.toBeInTheDocument();
  });

  it('offers editing and project creation to people who can do those things', async () => {
    const { loader } = recordingLoader(() =>
      brandPage([], { currentUserCanEdit: true, currentUserCanCreateProjects: true }),
    );
    renderBrandPage(loader);

    await screen.findByRole('heading', { name: 'Team No Pants' });
    expect(screen.getAllByRole('link', { name: 'New project' })[0]).toHaveAttribute(
      'href',
      '/brands/team-no-pants/projects/new',
    );
    expect(screen.getByRole('link', { name: 'Admin' })).toHaveAttribute('href', '/brands/team-no-pants/edit');
  });

  it('warns when the brand is awaiting approval', async () => {
    const { loader } = recordingLoader(() => brandPage([], { approved: false }));
    renderBrandPage(loader);

    expect(await screen.findByText(/Team No Pants is pending approval/)).toBeInTheDocument();
  });

  it('shows the not-found page when the brand cannot be seen', async () => {
    renderBrandPage(() => {
      throw new Response(null, { status: 404, statusText: 'Not Found' });
    });

    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  });

  it('loads more projects, by offset, when scrolled to the end', async () => {
    const user = userEvent.setup();
    const early = Array.from({ length: 5 }, (_, i) => buildProject(`Early Larp ${i + 1}`));
    const { loader, requests } = recordingLoader((url) =>
      url.searchParams.get('offset') === '5'
        ? brandPage([buildProject('Late Larp')], {}, { totalCount: 6, offset: 5 })
        : brandPage(early, {}, { totalCount: 6 }),
    );
    renderBrandPage(loader);

    await screen.findByText('Early Larp 1');
    await user.click(screen.getByTestId('waypoint'));

    expect(await screen.findByText('Late Larp')).toBeInTheDocument();
    expect(screen.getByText('Early Larp 5')).toBeInTheDocument();
    expect(requests.some((url) => url.searchParams.get('offset') === '5')).toBe(true);
  });

  it('does not load more when all projects are shown', async () => {
    const user = userEvent.setup();
    const { loader, requests } = recordingLoader(() =>
      brandPage(Array.from({ length: 5 }, (_, i) => buildProject(`Complete Larp ${i + 1}`))),
    );
    renderBrandPage(loader);

    await screen.findByText('Complete Larp 1');
    await user.click(screen.getByTestId('waypoint'));

    expect(screen.getAllByText(/^Complete Larp/)).toHaveLength(5);
    expect(requests).toHaveLength(1);
  });
});

describe('UnapprovedBrandAlert', () => {
  it.each([
    ['approved', true],
    ['null', null],
    ['undefined', undefined],
  ])('is hidden when approved is %s', (_label, approved) => {
    renderPage(<UnapprovedBrandAlert brand={{ name: 'Fine Brand', approved }} />);
    expect(screen.queryByText(/pending approval/)).not.toBeInTheDocument();
  });

  it('is shown when the brand has explicitly not been approved', () => {
    renderPage(<UnapprovedBrandAlert brand={{ name: 'Waiting Brand', approved: false }} />);
    expect(screen.getByText(/Waiting Brand is pending approval/)).toBeInTheDocument();
  });
});

describe('UnapprovedBrandsListPage', () => {
  function unapprovedBrand(
    id: number,
    name: string,
    overrides: Partial<UnapprovedBrandData> = {},
  ): UnapprovedBrandData {
    return {
      id,
      name,
      slug: name.toLowerCase(),
      createdAt: new Date('2026-03-04T05:06:07Z'),
      creator: { name: `${name} Owner`, email: `${name.toLowerCase()}@example.com` },
      ...overrides,
    };
  }

  it('lists the pending brands with their creators', async () => {
    renderRouteModule({
      default: UnapprovedBrandsListPage,
      loader: () => ({ brands: [unapprovedBrand(1, 'Alpha', { creator: null }), unapprovedBrand(2, 'Zeta')] }),
    });

    expect(await screen.findByRole('heading', { name: 'Brands pending approval' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Zeta' })).toHaveAttribute('href', '/brands/zeta');
    expect(screen.getByRole('link', { name: 'zeta@example.com' })).toHaveAttribute('href', 'mailto:zeta@example.com');
    expect(screen.getByText(/Zeta Owner/)).toBeInTheDocument();
  });

  it('approves a brand after confirmation and refreshes the list', async () => {
    const user = userEvent.setup();
    let pending = [unapprovedBrand(7, 'Zeta')];
    const submitted: unknown[] = [];
    renderRouteModule({
      default: UnapprovedBrandsListPage,
      loader: () => ({ brands: pending }),
      action: async ({ request }: { request: Request }) => {
        const body = await request.json();
        submitted.push(body);
        pending = [];
        return data(null);
      },
    });

    await user.click(await screen.findByRole('button', { name: 'Approve' }));
    expect(await screen.findByText(/Approve “Zeta”\?/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'OK', hidden: true }));

    await waitFor(() => expect(screen.queryByRole('link', { name: 'Zeta' })).not.toBeInTheDocument());
    expect(submitted).toEqual([{ brandId: 7 }]);
  });
});
