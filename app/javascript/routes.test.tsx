/// <reference types="vite/client" />
import { ApolloProvider } from '@apollo/client';
import { GraphQLError } from 'graphql';
import { Confirm } from '@neinteractiveliterature/litform';
import type { RouteConfigEntry } from '@react-router/dev/routes';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterContextProvider, RouterProvider, type RouteObject } from 'react-router';

import routes from './routes';
import { S3ConfigurationContext } from './S3ConfigurationContext';
import { appContext } from './appContext';
import { abilityContext, userContext } from './server/lib/authContext';
import { buildAbility } from './server/lib/authorization.server';
import { BrandPageQueryDocument, BrandsPageQueryDocument } from './Brands/queries.generated';
import { ProjectPromotionsPageQueryDocument } from './ProjectPromotions/queries.generated';
import { TagCategoryListPageQueryDocument } from './TagCategories/queries.generated';
import { TagListPageQueryDocument } from './Tags/queries.generated';
import { TagCategoryAutocompleteQueryDocument } from './TagCategories/queries.generated';
import { buildConnection } from '../../test/javascript/fixtures';
import {
  createMockApolloClient,
  routeFromModule,
  type MockedResponse,
  type RouteModuleUnderTest,
} from '../../test/javascript/testUtils';

const anyVariables = { variableMatcher: () => true, maxUsageCount: Number.POSITIVE_INFINITY };
const empty = [] as { id: string }[];

const pageMocks: MockedResponse[] = [
  {
    request: { query: BrandsPageQueryDocument },
    ...anyVariables,
    result: { data: { brands: buildConnection(empty) } },
  },
  {
    request: { query: ProjectPromotionsPageQueryDocument },
    ...anyVariables,
    result: { data: { projectPromotions: [] } },
  },
  {
    request: { query: TagListPageQueryDocument },
    ...anyVariables,
    result: { data: { tags: buildConnection(empty) } },
  },
  {
    request: { query: TagCategoryListPageQueryDocument },
    ...anyVariables,
    result: { data: { tagCategories: buildConnection(empty) } },
  },
  {
    request: { query: TagCategoryAutocompleteQueryDocument },
    ...anyVariables,
    result: { data: { tagCategories: buildConnection(empty) } },
  },
];

// routes.ts is the framework-mode route config (file paths, which the build loads lazily); here the same config is turned
// into ordinary react-router route objects, with the modules loaded up front, so the URL → page mapping can be tested.
// (entry.client.tsx isn't a route, and hydrates the page as soon as it's imported.)
const routeModules = import.meta.glob<RouteModuleUnderTest>(
  ['./**/*.{ts,tsx}', '!./**/*.test.{ts,tsx}', '!./**/*.generated.ts', '!./entry.client.tsx', '!./server/**'],
  { eager: true },
);

const serverLoaderStubs: Record<string, () => unknown> = {
  './HomePage/HomePage.tsx': () => ({ promotedProjects: [], tagGroups: [] }),
  './ProjectSearch/ProjectSearchPage.tsx': () => ({ projects: [], totalCount: 0, offset: 0, tag: null }),
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

function renderRoute(route: string, mocks: MockedResponse[]) {
  const apolloClient = createMockApolloClient(mocks);
  const s3Configuration = { awsRegion: 'us-east-1', awsAccessKeyId: 'key', bucketName: 'bucket' };
  const config = {
    graphqlCSRFToken: 'graphql',
    s3Configuration,
  };
  const router = createMemoryRouter(toRouteObjects(routes), {
    initialEntries: [route],
    getContext: () => {
      const context = new RouterContextProvider();
      context.set(appContext, { config, apolloClient });
      // a signed-out visitor
      context.set(userContext, null);
      context.set(abilityContext, buildAbility(null));
      return context;
    },
  });

  const result = render(
    <ApolloProvider client={apolloClient}>
      <S3ConfigurationContext.Provider value={s3Configuration}>
        <Confirm>
          <RouterProvider router={router} />
        </Confirm>
      </S3ConfigurationContext.Provider>
    </ApolloProvider>,
  );
  return { ...result, router };
}

describe('routes', () => {
  it.each([
    ['/', 'Welcome to Larp Library'],
    ['/pages/about', 'About Us'],
    ['/pages/licensing', 'Licensing'],
    ['/projects', 'Larps'],
    ['/brands', 'Larp creators'],
    ['/project_promotions', 'Project promotions'],
    ['/tags', 'Tags'],
    ['/tags/new', 'Create a new tag'],
    ['/tag_categories', 'Tag categories'],
    ['/tag_categories/new', 'Create a new tag category'],
  ])('routes %s to the page headed “%s”', async (route, heading) => {
    renderRoute(route, pageMocks);

    expect(await screen.findByRole('heading', { name: heading })).toBeInTheDocument();
    // every page sits inside the app layout
    expect(screen.getByRole('link', { name: 'Larp Library' })).toHaveAttribute('href', '/');
  });

  // These pages need richer data than is worth building here, so they're left unmocked: Apollo's "No more mocked
  // responses" error names the query the page ran, which shows the URL reached the right page.
  it.each([
    ['/brands/unapproved', 'UnapprovedBrandsListPageQuery'],
    ['/brands/acme', 'BrandPageQuery'],
    ['/brands/acme/edit', 'EditBrandQuery'],
    ['/brands/acme/invitations/tok123', 'InvitationPageQuery'],
    ['/brands/acme/projects/new', 'NewProjectFormQuery'],
    ['/brands/acme/projects/7-the-big-larp', 'ProjectPageQuery'],
    ['/brands/acme/projects/7-the-big-larp/edit', 'ProjectPageQuery'],
    ['/brands/acme/projects/7-the-big-larp/initial_content', 'ProjectPageQuery'],
    ['/tags/5/edit', 'EditTagQuery'],
    ['/tag_categories/3/edit', 'EditTagCategoryQuery'],
  ])('routes %s to the page that runs %s', async (route, queryName) => {
    renderRoute(route, []);

    expect(
      await screen.findByText(new RegExp(`No more mocked responses for the query: query ${queryName}\\b`)),
    ).toBeInTheDocument();
  });

  it('sends signed out visitors who open /brands/new off to sign in, before loading the page', async () => {
    // (no NewBrandQuery mock: the page never loads)
    const { router } = renderRoute('/brands/new', []);

    await waitFor(() => expect(router.state.location.pathname).toEqual('/sign-in'));
    expect(router.state.location.search).toEqual('?returnTo=%2Fbrands%2Fnew');
    expect(screen.queryByRole('heading', { name: 'Publish your larps' })).not.toBeInTheDocument();
  });

  it('shows the not-found page inside the layout when a brand does not exist', async () => {
    renderRoute('/brands/no-such-brand', [
      {
        request: { query: BrandPageQueryDocument },
        variableMatcher: () => true,
        result: { errors: [new GraphQLError('Brand not found', { extensions: { code: 'NOT_FOUND' } })] },
      },
    ]);

    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Larp Library' })).toBeInTheDocument();
  });

  it('shows a not-found page inside the layout for a URL no page claims', async () => {
    renderRoute('/no/such/page', pageMocks);

    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Larp Library' })).toBeInTheDocument();
  });
});
