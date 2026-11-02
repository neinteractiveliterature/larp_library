/// <reference types="vite/client" />
import { Confirm } from '@neinteractiveliterature/litform';
import type { RouteConfigEntry } from '@react-router/dev/routes';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterContextProvider, RouterProvider, type RouteObject } from 'react-router';

import routes from '~/routes';
import { abilityContext, userContext } from '~/server/lib/authContext';
import { buildAbility } from '~/server/lib/authorization.server';
import { buildProject } from './projectFixtures';
import { mockFetchJson, routeFromModule, type RouteModuleUnderTest } from './testUtils';

// routes.ts is the framework-mode route config (file paths, which the build loads lazily); here the same config is turned
// into ordinary react-router route objects, with the modules loaded up front, so the URL → page mapping can be tested.
// (entry.client.tsx and root.tsx aren't routes in this config: the first hydrates the page as soon as it's imported, and the
// second sets up the server's authentication.)
const globbedModules = import.meta.glob<RouteModuleUnderTest>(
  ['/app/**/*.{ts,tsx}', '!/app/**/*.generated.ts', '!/app/entry.client.tsx', '!/app/root.tsx', '!/app/server/**'],
  { eager: true },
);
// keyed the way routes.ts names a route's file: relative to the app directory ("./HomePage/HomePage.tsx")
const routeModules = Object.fromEntries(
  Object.entries(globbedModules).map(([file, routeModule]) => [file.replace('/app/', './'), routeModule]),
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serverLoaderStubs: Record<string, (args: any) => unknown> = {
  './HomePage/HomePage.tsx': () => ({ promotedProjects: [], tagGroups: [] }),
  './ProjectSearch/ProjectSearchPage.tsx': () => ({ projects: [], totalCount: 0, offset: 0, tag: null }),
  './Brands/BrandListPage.tsx': () => ({ brands: [], totalCount: 0, offset: 0 }),
  './Brands/UnapprovedBrandsListPage.tsx': () => ({ brands: [] }),
  './Brands/BrandPage.tsx': ({ params }: { params: { brandSlug: string } }) => {
    if (params.brandSlug === 'no-such-brand') {
      throw new Response(null, { status: 404, statusText: 'Not Found' });
    }
    return {
      brand: {
        id: 1,
        name: 'Acme Games',
        slug: params.brandSlug,
        description: null,
        approved: true,
        currentUserCanEdit: false,
        currentUserCanCreateProjects: false,
      },
      projects: [],
      totalCount: 0,
      offset: 0,
    };
  },
  './Brands/EditBrandPage.tsx': () => ({
    brand: {
      id: 1,
      name: 'Acme Games',
      slug: 'acme',
      description: null,
      approved: true,
      currentUserCanManageMemberships: false,
    },
    brandMemberships: [],
    currentUserId: null,
  }),
  './Invitations/InvitationPage.tsx': () => ({
    brandMembership: { id: 1, admin: false, brand: { id: 1, name: 'Acme Games', slug: 'acme' } },
    currentUser: null,
  }),
  './Project/ProjectPage.tsx': () => ({ project: buildProject() }),
  './Project/EditProjectPage.tsx': () => ({ project: buildProject() }),
  './Project/ProjectInitialContentPage.tsx': () => ({ project: buildProject() }),
  './Project/NewProjectPage.tsx': () => ({ brand: { id: 1, name: 'Acme', slug: 'acme' } }),
  './Tags/TagListPage.tsx': () => ({ tags: [] }),
  './ProjectPromotions/ProjectPromotionsPage.tsx': () => ({ projectPromotions: [] }),
  './TagCategories/TagCategoryListPage.tsx': () => ({ tagCategories: [] }),
  // (the promotions, new and edit pages require an administrator or a brand's administrator, which the signed-out visitor of these tests isn't)
  './Tags/NewTagPage.tsx': () => null,
  './TagCategories/NewTagCategoryPage.tsx': () => null,
  './Tags/EditTagPage.tsx': () => ({ tag: { id: 5, name: 'horde', tagCategory: null }, projectCount: 0 }),
  './TagCategories/EditTagCategoryPage.tsx': () => ({
    tagCategory: { id: 3, name: 'Genre', color: '#777777', textColor: '#ffffff', icon: 'tag' },
    tags: [],
  }),
};

function toRouteObjects(entries: RouteConfigEntry[]): RouteObject[] {
  return entries.map((entry): RouteObject => {
    // The server-only resource routes (better-auth's endpoints, sign-in and sign-out) aren't pages, and nothing here
    // runs them; they're empty routes, so a redirect to one can be seen
    const routeModule = entry.file.startsWith('./server/routes/') ? {} : routeModules[entry.file];
    // Pages whose loaders query the database can't run theirs here (those are tested against a real database); this only
    // checks that the URL reaches the page, so it's given empty data
    const loaderStub = serverLoaderStubs[entry.file];
    if (!routeModule) {
      throw new Error(`routes.ts refers to ${entry.file}, which doesn't exist`);
    }
    const route = routeFromModule(
      loaderStub ? { ...routeModule, loader: loaderStub } : routeModule,
      entry.index ? { index: true, id: entry.file } : { path: entry.path, id: entry.file },
    );
    return entry.children && !route.index ? { ...route, children: toRouteObjects(entry.children) } : route;
  });
}

function renderRoute(route: string) {
  const router = createMemoryRouter(toRouteObjects(routes), {
    initialEntries: [route],
    getContext: () => {
      const context = new RouterContextProvider();
      // a signed-out visitor
      context.set(userContext, null);
      context.set(abilityContext, buildAbility(null));
      return context;
    },
  });

  const result = render(
    <Confirm>
      <RouterProvider router={router} />
    </Confirm>,
  );
  return { ...result, router };
}

describe('routes', () => {
  // the tag form's category picker asks for its options as soon as it appears
  beforeEach(() => {
    mockFetchJson(() => []);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    ['/', 'Welcome to Larp Library'],
    ['/pages/about', 'About Us'],
    ['/pages/licensing', 'Licensing'],
    ['/projects', 'Larps'],
    ['/brands', 'Larp creators'],
    ['/brands/unapproved', 'Brands pending approval'],
    ['/brands/acme', 'Acme Games'],
    ['/brands/acme/edit', 'Settings'],
    ['/brands/acme/invitations/tok123', 'Welcome to Larp Library!'],
    ['/project_promotions', 'Project promotions'],
    ['/tags', 'Tags'],
    ['/tags/new', 'Create a new tag'],
    ['/tag_categories', 'Tag categories'],
    ['/tag_categories/new', 'Create a new tag category'],
    ['/tags/5/edit', 'Editing tag: horde'],
    ['/tag_categories/3/edit', 'Editing tag category: Genre'],
    ['/brands/acme/projects/7-the-big-larp', /^The Big Larp/],
    ['/brands/acme/projects/7-the-big-larp/edit', 'Editing project “The Big Larp”'],
    ['/brands/acme/projects/7-the-big-larp/initial_content', 'Content'],
  ])('routes %s to the page headed %s', async (route, heading) => {
    renderRoute(route);

    expect(await screen.findByRole('heading', { name: heading })).toBeInTheDocument();
    // every page sits inside the app layout
    expect(screen.getByRole('link', { name: 'Larp Library' })).toHaveAttribute('href', '/');
  });

  it('routes the new project page to its form', async () => {
    renderRoute('/brands/acme/projects/new');

    expect(await screen.findByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save project' })).toBeInTheDocument();
  });

  it('sends signed out visitors who open /brands/new off to sign in, before loading the page', async () => {
    // (no NewBrandQuery mock: the page never loads)
    const { router } = renderRoute('/brands/new');

    await waitFor(() => expect(router.state.location.pathname).toEqual('/sign-in'));
    expect(router.state.location.search).toEqual('?returnTo=%2Fbrands%2Fnew');
    expect(screen.queryByRole('heading', { name: 'Publish your larps' })).not.toBeInTheDocument();
  });

  it('shows the not-found page inside the layout when a brand does not exist', async () => {
    renderRoute('/brands/no-such-brand');

    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Larp Library' })).toBeInTheDocument();
  });

  it('shows a not-found page inside the layout for a URL no page claims', async () => {
    renderRoute('/no/such/page');

    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Larp Library' })).toBeInTheDocument();
  });
});
