import mapValues from 'lodash/mapValues';
import React from 'react';
import { Route, Routes } from 'react-router';
import AppLayout from './AppLayout';
import { S3ConfigurationContext, S3ConfigurationContextValue } from './S3ConfigurationContext';

const PageComponentImports: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [pageName: string]: () => Promise<{ default: React.ComponentType<any> }>;
} = {
  AboutPage: () => import(/* webpackChunkName: "AboutPage" */ './StaticPages/AboutPage'),
  BrandPage: () => import(/* webpackChunkName: "BrandPage" */ './Brands/BrandPage'),
  BrandListPage: () => import(/* webpackChunkName: "BrandListPage" */ './Brands/BrandListPage'),
  EditBrandPage: () => import(/* webpackChunkName: "EditBrandPage" */ './Brands/EditBrandPage'),
  EditProjectPage: () => import(/* webpackChunkName: "EditProjectPage" */ './Project/EditProjectPage'),
  EditTagPage: () => import(/* webpackChunkName: "EditTagPage" */ './Tags/EditTagPage'),
  EditTagCategoryPage: () =>
    import(/* webpackChunkName: "EditTagCategoryPage" */ './TagCategories/EditTagCategoryPage'),
  LicensingPage: () => import(/* webpackChunkName: "LicensingPage" */ './StaticPages/LicensingPage'),
  NewBrandPage: () => import(/* webpackChunkName: "NewBrandPage" */ './Brands/NewBrandPage'),
  NewProjectPage: () => import(/* webpackChunkName: "NewProjectPage" */ './Project/NewProjectPage'),
  NewTagPage: () => import(/* webpackChunkName: "NewTagPage" */ './Tags/NewTagPage'),
  NewTagCategoryPage: () => import(/* webpackChunkName: "NewTagCategoryPage" */ './TagCategories/NewTagCategoryPage'),
  HomePage: () => import(/* webpackChunkName: "HomePage" */ './HomePage/HomePage'),
  InvitationPage: () => import(/* webpackChunkName: "InvitationPage" */ './Invitations/InvitationPage'),
  ProjectInitialContentPage: () =>
    import(/* webpackChunkName: "ProjectInitialContentPage" */ './Project/ProjectInitialContentPage'),
  ProjectPromotionsPage: () =>
    import(/* webpackChunkName: "ProjectPromotionsPage" */ './ProjectPromotions/ProjectPromotionsPage'),
  ProjectPage: () => import(/* webpackChunkName: "ProjectPage" */ './Project/ProjectPage'),
  ProjectSearchPage: () => import(/* webpackChunkName: "ProjectSearchPage" */ './ProjectSearch/ProjectSearchPage'),
  TagListPage: () => import(/* webpackChunkName: "TagListPage" */ './Tags/TagListPage'),
  TagCategoryListPage: () =>
    import(/* webpackChunkName: "TagCategoryListPage" */ './TagCategories/TagCategoryListPage'),
  UnapprovedBrandsListPage: () =>
    import(/* webpackChunkName: "UnapprovedBrandsListPage" */ './Brands/UnapprovedBrandsListPage'),
};

const PageComponents = mapValues(PageComponentImports, (importFunction) => React.lazy(importFunction));

export type AppRootProps = {
  s3Configuration: S3ConfigurationContextValue;
  signInCSRFToken: string;
  signOutCSRFToken: string;
};

function AppRoot({ s3Configuration, signInCSRFToken, signOutCSRFToken }: AppRootProps): JSX.Element {
  return (
    <S3ConfigurationContext.Provider value={s3Configuration}>
      <AppLayout signInCSRFToken={signInCSRFToken} signOutCSRFToken={signOutCSRFToken}>
        <Routes>
          <Route path="projects" element={<PageComponents.ProjectSearchPage />} />

          <Route path="brands/*">
            <Route path="unapproved" element={<PageComponents.UnapprovedBrandsListPage />} />
            <Route path="new" element={<PageComponents.NewBrandPage />} />

            <Route path=":brandSlug/*">
              <Route path="invitations/:invitationToken" element={<PageComponents.InvitationPage />} />
              <Route path="edit" element={<PageComponents.EditBrandPage />} />
              <Route path="projects/*">
                <Route path=":projectId/edit" element={<PageComponents.EditProjectPage />} />
                <Route path=":projectId/initial_content" element={<PageComponents.ProjectInitialContentPage />} />
                <Route path=":projectId" element={<PageComponents.ProjectPage />} />
                <Route path="new" element={<PageComponents.NewProjectPage />} />
              </Route>
              <Route path="" element={<PageComponents.BrandPage />} />
            </Route>

            <Route path="" element={<PageComponents.BrandListPage />} />
          </Route>

          <Route path="project_promotions" element={<PageComponents.ProjectPromotionsPage />} />

          <Route path="tags/*">
            <Route path="new" element={<PageComponents.NewTagPage />} />
            <Route path=":tagId/edit" element={<PageComponents.EditTagPage />} />
            <Route path="" element={<PageComponents.TagListPage />} />
          </Route>

          <Route path="tag_categories/*">
            <Route path="new" element={<PageComponents.NewTagCategoryPage />} />
            <Route path=":tagCategoryId/edit" element={<PageComponents.EditTagCategoryPage />} />
            <Route path="" element={<PageComponents.TagCategoryListPage />} />
          </Route>

          <Route path="pages/about" element={<PageComponents.AboutPage />} />
          <Route path="pages/licensing" element={<PageComponents.LicensingPage />} />

          <Route path="/" element={<PageComponents.HomePage />} />
        </Routes>
      </AppLayout>
    </S3ConfigurationContext.Provider>
  );
}

export default AppRoot;
