import { index, layout, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  // better-auth's endpoints (the OAuth callback and so on), and the sign-in and sign-out redirects
  route('api/auth/*', './server/routes/authApi.ts'),
  route('sign-in', './server/routes/signIn.ts'),
  route('sign-out', './server/routes/signOut.ts'),

  layout('./AppLayoutRoute.tsx', [
    index('./HomePage/HomePage.tsx'),

    route('projects', './ProjectSearch/ProjectSearchPage.tsx'),

    route('brands', './Brands/BrandListPage.tsx'),
    route('brands/unapproved', './Brands/UnapprovedBrandsListPage.tsx'),
    layout('./SignedInRoute.tsx', [route('brands/new', './Brands/NewBrandPage.tsx')]),
    route('brands/:brandSlug', './Brands/BrandPage.tsx'),
    route('brands/:brandSlug/edit', './Brands/EditBrandPage.tsx'),
    route('brands/:brandSlug/invitations/:invitationToken', './Invitations/InvitationPage.tsx'),
    route('brands/:brandSlug/projects/new', './Project/NewProjectPage.tsx'),
    route('brands/:brandSlug/projects/:projectId', './Project/ProjectPage.tsx'),
    route('brands/:brandSlug/projects/:projectId/edit', './Project/EditProjectPage.tsx'),
    route('brands/:brandSlug/projects/:projectId/initial_content', './Project/ProjectInitialContentPage.tsx'),
    // no page, just the actions the content tab's file and link cards submit to
    route('brands/:brandSlug/projects/:projectId/content', './Project/ProjectContentRoute.ts'),

    route('project_promotions', './ProjectPromotions/ProjectPromotionsPage.tsx'),

    route('tags', './Tags/TagListPage.tsx'),
    route('tags/new', './Tags/NewTagPage.tsx'),
    route('tags/:tagId/edit', './Tags/EditTagPage.tsx'),

    route('tag_categories', './TagCategories/TagCategoryListPage.tsx'),
    route('tag_categories/new', './TagCategories/NewTagCategoryPage.tsx'),
    route('tag_categories/:tagCategoryId/edit', './TagCategories/EditTagCategoryPage.tsx'),

    route('pages/about', './StaticPages/AboutPage.tsx'),
    route('pages/licensing', './StaticPages/LicensingPage.tsx'),

    route('*', './NotFoundPage.tsx'),
  ]),
] satisfies RouteConfig;
