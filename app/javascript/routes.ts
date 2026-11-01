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
    // no page, just the requests the file upload makes: for somewhere to send the file, and to report it sent
    route('brands/:brandSlug/projects/:projectId/uploads', './Project/ProjectUploadRoute.ts'),

    route('project_promotions', './ProjectPromotions/ProjectPromotionsPage.tsx'),
    // no page, just the JSON the project picker on the promotions page asks for as the user types
    route('project_promotions/projects', './ProjectPromotions/ProjectSearchRoute.ts'),

    route('tags', './Tags/TagListPage.tsx'),
    // no page, just the JSON the tag pickers ask for as the user types
    route('tags/autocomplete', './Tags/TagAutocompleteRoute.ts'),
    route('tags/new', './Tags/NewTagPage.tsx'),
    route('tags/:tagId/edit', './Tags/EditTagPage.tsx'),

    route('tag_categories', './TagCategories/TagCategoryListPage.tsx'),
    // no page, just the JSON the tag category picker asks for as the user types
    route('tag_categories/autocomplete', './TagCategories/TagCategoryAutocompleteRoute.ts'),
    route('tag_categories/new', './TagCategories/NewTagCategoryPage.tsx'),
    route('tag_categories/:tagCategoryId/edit', './TagCategories/EditTagCategoryPage.tsx'),

    route('pages/about', './StaticPages/AboutPage.tsx'),
    route('pages/licensing', './StaticPages/LicensingPage.tsx'),

    route('*', './NotFoundPage.tsx'),
  ]),
] satisfies RouteConfig;
