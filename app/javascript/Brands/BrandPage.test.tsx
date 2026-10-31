import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BrandPage from './BrandPage';
import UnapprovedBrandAlert from './UnapprovedBrandAlert';
import UnapprovedBrandsListPage from './UnapprovedBrandsListPage';
import { BrandPageQueryDocument, UnapprovedBrandsListPageQueryDocument } from './queries.generated';
import { ApproveBrandDocument } from './mutations.generated';
import { buildBrand, buildConnection, buildProjectHeaders, resetFixtureIds } from '../../../test/javascript/fixtures';
import { MockedResponse, renderPage } from '../../../test/javascript/testUtils';

vi.mock('../Waypoint', () => import('../../../test/javascript/mockWaypoint'));

function brandPageMock(
  brand: ReturnType<typeof buildBrand>,
  projects: (ReturnType<typeof buildProjectHeaders> & { description: string | null })[],
  { totalCount = projects.length, after }: { totalCount?: number; after?: string } = {},
): MockedResponse {
  return {
    request: { query: BrandPageQueryDocument },
    variableMatcher: (variables) => (after ? variables.projectsAfter === after : variables.projectsAfter == null),
    result: { data: { brand: { ...brand, projects: buildConnection(projects, { totalCount }) } } },
  };
}

const withDescription = (overrides: Record<string, unknown> = {}) => ({
  ...buildProjectHeaders(overrides),
  description: 'A larp description',
});

describe('BrandPage', () => {
  beforeEach(() => resetFixtureIds());

  const renderBrandPage = (mocks: MockedResponse[]) =>
    renderPage(<BrandPage />, { mocks, route: '/brands/team-no-pants', path: '/brands/:brandSlug' });

  it('shows the brand, its description and its projects', async () => {
    const brand = buildBrand({ name: 'Team No Pants', slug: 'team-no-pants', description: 'We make **bold** games.' });
    renderBrandPage([brandPageMock(brand, [withDescription({ title: 'Pantsless Larp' })])]);

    expect(await screen.findByRole('heading', { name: 'Team No Pants' })).toBeInTheDocument();
    expect(screen.getByText('bold').tagName).toEqual('STRONG');
    expect(screen.getByText('Pantsless Larp')).toBeInTheDocument();
    // without permissions there are no admin controls
    expect(screen.queryByRole('link', { name: 'New project' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
    expect(screen.queryByText(/pending approval/)).not.toBeInTheDocument();
  });

  it('offers editing and project creation to people who can do those things', async () => {
    const brand = buildBrand({
      slug: 'team-no-pants',
      currentUserCanEdit: true,
      currentUserCanCreateProjects: true,
      description: null,
    });
    renderBrandPage([brandPageMock(brand, [])]);

    expect(await screen.findAllByRole('link', { name: 'New project' })).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Admin' })).toHaveAttribute('href', '/brands/team-no-pants/edit');
    expect(screen.getAllByRole('link', { name: 'New project' })[0]).toHaveAttribute(
      'href',
      '/brands/team-no-pants/projects/new',
    );
  });

  it('warns when the brand is awaiting approval', async () => {
    renderBrandPage([brandPageMock(buildBrand({ name: 'Newbies', approved: false }), [])]);

    expect(await screen.findByText(/Newbies is pending approval/)).toBeInTheDocument();
  });

  it('shows an error if the brand cannot be loaded', async () => {
    renderBrandPage([
      { request: { query: BrandPageQueryDocument }, variableMatcher: () => true, error: new Error('no such brand') },
    ]);

    expect(await screen.findByText(/no such brand/)).toBeInTheDocument();
  });

  it('loads more projects when scrolled to the end', async () => {
    const user = userEvent.setup();
    const brand = buildBrand({ slug: 'team-no-pants' });
    const firstPage = Array.from({ length: 5 }, (_, i) => withDescription({ title: `Early Larp ${i + 1}` }));
    renderBrandPage([
      brandPageMock(brand, firstPage, { totalCount: 6 }),
      brandPageMock(brand, [withDescription({ title: 'Late Larp' })], {
        totalCount: 6,
        after: `cursor-${firstPage[4].id}`,
      }),
    ]);

    await screen.findByText('Early Larp 1');
    await user.click(screen.getByTestId('waypoint'));
    expect(await screen.findByText('Late Larp')).toBeInTheDocument();
  });

  it('does not load more when all projects are shown', async () => {
    const user = userEvent.setup();
    const brand = buildBrand({ slug: 'team-no-pants' });
    const projects = Array.from({ length: 5 }, (_, i) => withDescription({ title: `Complete Larp ${i + 1}` }));
    renderBrandPage([brandPageMock(brand, projects)]);

    await screen.findByText('Complete Larp 1');
    await user.click(screen.getByTestId('waypoint'));
    expect(screen.getAllByText(/^Complete Larp/)).toHaveLength(5);
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
  beforeEach(() => resetFixtureIds());

  function unapprovedBrand(name: string, overrides: Record<string, unknown> = {}) {
    return {
      ...buildBrand({ name }),
      createdAt: '2026-03-04T05:06:07Z',
      creator: {
        __typename: 'User',
        id: `creator-${name}`,
        email: `${name.toLowerCase()}@example.com`,
        name: `${name} Owner`,
      },
      ...overrides,
    };
  }

  it('lists the pending brands alphabetically with their creators', async () => {
    renderPage(<UnapprovedBrandsListPage />, {
      mocks: [
        {
          request: { query: UnapprovedBrandsListPageQueryDocument },
          result: {
            data: { brands: buildConnection([unapprovedBrand('Zeta'), unapprovedBrand('Alpha', { creator: null })]) },
          },
        },
      ],
    });

    expect(await screen.findByRole('heading', { name: 'Brands pending approval' })).toBeInTheDocument();
    const links = screen.getAllByRole('link').map((link) => link.textContent);
    expect(links.indexOf('Alpha')).toBeLessThan(links.indexOf('Zeta'));
    expect(screen.getByRole('link', { name: 'zeta@example.com' })).toHaveAttribute('href', 'mailto:zeta@example.com');
    expect(screen.getByText(/Zeta Owner/)).toBeInTheDocument();
  });

  it('approves a brand after confirmation and refreshes the list', async () => {
    const user = userEvent.setup();
    const zeta = unapprovedBrand('Zeta');
    const listMock = (brands: ReturnType<typeof unapprovedBrand>[]): MockedResponse => ({
      request: { query: UnapprovedBrandsListPageQueryDocument },
      result: { data: { brands: buildConnection(brands) } },
    });
    let approved = false;
    renderPage(<UnapprovedBrandsListPage />, {
      mocks: [
        listMock([zeta]),
        {
          request: { query: ApproveBrandDocument, variables: { id: zeta.id } },
          result: () => {
            approved = true;
            return {
              data: {
                approveBrand: {
                  __typename: 'ApproveBrandPayload',
                  brand: { ...zeta, approved: true, currentUserCanEdit: false, currentUserCanCreateProjects: false },
                },
              },
            };
          },
        },
        listMock([]),
      ],
    });

    await user.click(await screen.findByRole('button', { name: 'Approve' }));
    expect(await screen.findByText(/Approve “Zeta”\?/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'OK', hidden: true }));

    await screen.findByRole('heading', { name: 'Brands pending approval' });
    await vi.waitFor(() => expect(approved).toBe(true));
    await vi.waitFor(() => expect(screen.queryByRole('link', { name: 'Zeta' })).not.toBeInTheDocument());
  });
});
