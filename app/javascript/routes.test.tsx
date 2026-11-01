/// <reference types="vite/client" />
import { ApolloProvider } from '@apollo/client';
import { GraphQLError } from 'graphql';
import { Confirm } from '@neinteractiveliterature/litform';
import type { RouteConfigEntry } from '@react-router/dev/routes';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterContextProvider, RouterProvider, type RouteObject } from 'react-router';

import routes from './routes';
import { CSRFTokensContext } from './CSRFTokensContext';
import { S3ConfigurationContext } from './S3ConfigurationContext';
import { appContext } from './appContext';
import { AppLayoutQueryDocument } from './queries.generated';
import { SetReturnUrlDocument } from './mutations.generated';
import { LicensingPageQueryDocument } from './StaticPages/queries.generated';
import { BrandPageQueryDocument, BrandsPageQueryDocument } from './Brands/queries.generated';
import { ProjectSearchQueryDocument } from './ProjectSearch/queries.generated';
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

const layoutMock: MockedResponse = {
  request: { query: AppLayoutQueryDocument },
  maxUsageCount: Number.POSITIVE_INFINITY,
  result: {
    data: {
      currentUser: null,
      currentAbility: {
        __typename: 'Ability',
        canApproveBrands: false,
        canCreateProjectPromotions: false,
        canUpdateTags: false,
        canUpdateTagCategories: false,
      },
    },
  },
};

const pageMocks: MockedResponse[] = [
  layoutMock,
  { request: { query: LicensingPageQueryDocument }, ...anyVariables, result: { data: { licenses: [] } } },
  {
    request: { query: BrandsPageQueryDocument },
    ...anyVariables,
    result: { data: { brands: buildConnection(empty) } },
  },
  {
    request: { query: ProjectSearchQueryDocument },
    ...anyVariables,
    result: { data: { projects: buildConnection(empty), tagByName: null } },
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
  ['./**/*.{ts,tsx}', '!./**/*.test.{ts,tsx}', '!./**/*.generated.ts', '!./entry.client.tsx'],
  { eager: true },
);

function toRouteObjects(entries: RouteConfigEntry[]): RouteObject[] {
  return entries.map((entry): RouteObject => {
    const routeModule = routeModules[entry.file];
    if (!routeModule) {
      throw new Error(`routes.ts refers to ${entry.file}, which doesn't exist`);
    }
    const route = routeFromModule(
      routeModule,
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
    signInCSRFToken: 'in',
    signOutCSRFToken: 'out',
    s3Configuration,
    sentryDsn: null,
    currentUserId: null,
  };
  const router = createMemoryRouter(toRouteObjects(routes), {
    initialEntries: [route],
    getContext: () => new RouterContextProvider(new Map([[appContext, { config, apolloClient }]])),
  });

  return render(
    <ApolloProvider client={apolloClient}>
      <S3ConfigurationContext.Provider value={s3Configuration}>
        <CSRFTokensContext.Provider value={{ signInCSRFToken: 'in', signOutCSRFToken: 'out' }}>
          <Confirm>
            <RouterProvider router={router} />
          </Confirm>
        </CSRFTokensContext.Provider>
      </S3ConfigurationContext.Provider>
    </ApolloProvider>,
  );
}

describe('routes', () => {
  it.each([
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
    ['/', 'HomePageQuery'],
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
    renderRoute(route, [layoutMock]);

    expect(
      await screen.findByText(new RegExp(`No more mocked responses for the query: query ${queryName}\\b`)),
    ).toBeInTheDocument();
  });

  it('sends signed out visitors who open /brands/new off to sign in, before loading the page', async () => {
    const submitted: string[] = [];
    vi.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation(function (this: HTMLFormElement) {
      submitted.push(this.getAttribute('action') ?? '');
    });
    let returnUrl: string | undefined;
    renderRoute('/brands/new', [
      layoutMock,
      {
        request: { query: SetReturnUrlDocument },
        variableMatcher: () => true,
        result: (variables: { returnUrl: string }) => {
          returnUrl = variables.returnUrl;
          return { data: { setReturnUrl: { __typename: 'SetReturnUrlPayload', clientMutationId: null } } };
        },
      },
      // (no NewBrandQuery mock: the page never loads)
    ]);

    // Testing Library's waitFor (not vi.waitFor) tells React that async updates are expected while it waits
    await waitFor(() => expect(submitted).toEqual(['/users/auth/intercode']));
    expect(returnUrl).toEqual('/brands/new');
    expect(screen.queryByRole('heading', { name: 'Publish your larps' })).not.toBeInTheDocument();
    vi.restoreAllMocks();
    document.querySelectorAll('body > form').forEach((form) => form.remove());
  });

  it('shows the not-found page inside the layout when a brand does not exist', async () => {
    renderRoute('/brands/no-such-brand', [
      layoutMock,
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
