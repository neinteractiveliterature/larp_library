import { screen, waitFor } from '@testing-library/react';

import AppRoot from './AppRoot';
import { AppLayoutQueryDocument } from './queries.generated';
import { SetReturnUrlDocument } from './mutations.generated';
import { LicensingPageQueryDocument } from './StaticPages/queries.generated';
import { BrandsPageQueryDocument } from './Brands/queries.generated';
import { ProjectSearchQueryDocument } from './ProjectSearch/queries.generated';
import { ProjectPromotionsPageQueryDocument } from './ProjectPromotions/queries.generated';
import { TagCategoryListPageQueryDocument } from './TagCategories/queries.generated';
import { TagListPageQueryDocument } from './Tags/queries.generated';
import { TagCategoryAutocompleteQueryDocument } from './TagCategories/queries.generated';
import { buildConnection } from '../../test/javascript/fixtures';
import { MockedResponse, renderPage } from '../../test/javascript/testUtils';

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

describe('AppRoot', () => {
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
    renderPage(
      <AppRoot
        s3Configuration={{ awsRegion: 'us-east-1', awsAccessKeyId: 'key', bucketName: 'bucket' }}
        signInCSRFToken="in"
        signOutCSRFToken="out"
      />,
      { route, mocks: pageMocks },
    );

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
    renderPage(
      <AppRoot
        s3Configuration={{ awsRegion: 'us-east-1', awsAccessKeyId: 'key', bucketName: 'bucket' }}
        signInCSRFToken="in"
        signOutCSRFToken="out"
      />,
      { route, mocks: [layoutMock] },
    );

    expect(
      await screen.findByText(new RegExp(`No more mocked responses for the query: query ${queryName}\\b`)),
    ).toBeInTheDocument();
  });

  it('sends signed out visitors who open /brands/new off to sign in', async () => {
    // the layout query has already told the cache nobody is signed in, so the page redirects without querying
    const submitted: string[] = [];
    vi.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation(function (this: HTMLFormElement) {
      submitted.push(this.getAttribute('action') ?? '');
    });
    renderPage(
      <AppRoot
        s3Configuration={{ awsRegion: 'us-east-1', awsAccessKeyId: 'key', bucketName: 'bucket' }}
        signInCSRFToken="in"
        signOutCSRFToken="out"
      />,
      {
        route: '/brands/new',
        mocks: [
          layoutMock,
          {
            request: { query: SetReturnUrlDocument },
            variableMatcher: () => true,
            result: { data: { setReturnUrl: { __typename: 'SetReturnUrlPayload', clientMutationId: null } } },
          },
        ],
      },
    );

    expect(await screen.findByText('Please wait, redirecting...')).toBeInTheDocument();
    // Testing Library's waitFor (not vi.waitFor) tells React that async updates are expected while it waits; the sign-in
    // mutation finishes during this wait
    await waitFor(() => expect(submitted).toEqual(['/users/auth/intercode']));
    vi.restoreAllMocks();
    document.querySelectorAll('form').forEach((form) => form.remove());
  });

  it('shows just the layout for a URL no page claims', async () => {
    renderPage(
      <AppRoot
        s3Configuration={{ awsRegion: 'us-east-1', awsAccessKeyId: 'key', bucketName: 'bucket' }}
        signInCSRFToken="in"
        signOutCSRFToken="out"
      />,
      { route: '/no/such/page', mocks: pageMocks },
    );

    expect(await screen.findByRole('link', { name: 'Larp Library' })).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});
