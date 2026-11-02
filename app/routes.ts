import { index, layout, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  // better-auth's endpoints (the OAuth callback and so on), and the sign-in and sign-out redirects
  route('api/auth/*', './routes/auth/authApi.ts'),
  route('sign-in', './routes/auth/signIn.ts'),
  route('sign-out', './routes/auth/signOut.ts'),

  layout('./routes/AppLayoutRoute.tsx', [
    index('./routes/home-page/HomePage.tsx'),

    route('projects', './routes/project-search/ProjectSearchPage.tsx'),

    route('brands', './routes/brands/BrandListPage.tsx'),
    route('brands/unapproved', './routes/brands/UnapprovedBrandsListPage.tsx'),
    layout('./routes/SignedInRoute.tsx', [route('brands/new', './routes/brands/NewBrandPage.tsx')]),
    route('brands/:brandSlug', './routes/brands/BrandPage.tsx'),
    route('brands/:brandSlug/edit', './routes/brands/EditBrandPage.tsx'),
    route('brands/:brandSlug/invitations/:invitationToken', './routes/invitations/InvitationPage.tsx'),
    route('brands/:brandSlug/projects/new', './routes/project/NewProjectPage.tsx'),
    route('brands/:brandSlug/projects/:projectId', './routes/project/ProjectPage.tsx'),
    route('brands/:brandSlug/projects/:projectId/edit', './routes/project/EditProjectPage.tsx'),
    route('brands/:brandSlug/projects/:projectId/initial_content', './routes/project/ProjectInitialContentPage.tsx'),
    // no page, just the actions the content tab's file and link cards submit to
    route('brands/:brandSlug/projects/:projectId/content', './routes/project/ProjectContentRoute.ts'),
    // no page, just the requests the file upload makes: for somewhere to send the file, and to report it sent
    route('brands/:brandSlug/projects/:projectId/uploads', './routes/project/ProjectUploadRoute.ts'),

    route('project_promotions', './routes/project-promotions/ProjectPromotionsPage.tsx'),
    // no page, just the JSON the project picker on the promotions page asks for as the user types
    route('project_promotions/projects', './routes/project-promotions/ProjectSearchRoute.ts'),

    route('tags', './routes/tags/TagListPage.tsx'),
    // no page, just the JSON the tag pickers ask for as the user types
    route('tags/autocomplete', './routes/tags/TagAutocompleteRoute.ts'),
    route('tags/new', './routes/tags/NewTagPage.tsx'),
    route('tags/:tagId/edit', './routes/tags/EditTagPage.tsx'),

    route('tag_categories', './routes/tag-categories/TagCategoryListPage.tsx'),
    // no page, just the JSON the tag category picker asks for as the user types
    route('tag_categories/autocomplete', './routes/tag-categories/TagCategoryAutocompleteRoute.ts'),
    route('tag_categories/new', './routes/tag-categories/NewTagCategoryPage.tsx'),
    route('tag_categories/:tagCategoryId/edit', './routes/tag-categories/EditTagCategoryPage.tsx'),

    route('pages/about', './routes/static-pages/AboutPage.tsx'),
    route('pages/licensing', './routes/static-pages/LicensingPage.tsx'),

    route('*', './routes/NotFoundPage.tsx'),
  ]),
] satisfies RouteConfig;
