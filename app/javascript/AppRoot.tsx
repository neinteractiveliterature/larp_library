import mapValues from 'lodash/mapValues';
import React, { type JSX } from 'react';
import { Route, Routes } from 'react-router';
import AppLayout from './AppLayout';
import { S3ConfigurationContext, S3ConfigurationContextValue } from './S3ConfigurationContext';

const PageComponentImports: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [pageName: string]: () => Promise<{ default: React.ComponentType<any> }>;
} = {
  AboutPage: () => import('./StaticPages/AboutPage'),
  BrandPage: () => import('./Brands/BrandPage'),
  BrandListPage: () => import('./Brands/BrandListPage'),
  EditBrandPage: () => import('./Brands/EditBrandPage'),
  EditProjectPage: () => import('./Project/EditProjectPage'),
  EditTagPage: () => import('./Tags/EditTagPage'),
  EditTagCategoryPage: () => import('./TagCategories/EditTagCategoryPage'),
  LicensingPage: () => import('./StaticPages/LicensingPage'),
  NewBrandPage: () => import('./Brands/NewBrandPage'),
  NewProjectPage: () => import('./Project/NewProjectPage'),
  NewTagPage: () => import('./Tags/NewTagPage'),
  NewTagCategoryPage: () => import('./TagCategories/NewTagCategoryPage'),
  HomePage: () => import('./HomePage/HomePage'),
  InvitationPage: () => import('./Invitations/InvitationPage'),
  ProjectInitialContentPage: () => import('./Project/ProjectInitialContentPage'),
  ProjectPromotionsPage: () => import('./ProjectPromotions/ProjectPromotionsPage'),
  ProjectPage: () => import('./Project/ProjectPage'),
  ProjectSearchPage: () => import('./ProjectSearch/ProjectSearchPage'),
  TagListPage: () => import('./Tags/TagListPage'),
  TagCategoryListPage: () => import('./TagCategories/TagCategoryListPage'),
  UnapprovedBrandsListPage: () => import('./Brands/UnapprovedBrandsListPage'),
};

const PageComponents = mapValues(PageComponentImports, (importFunction) => React.lazy(importFunction));

export type AppRootProps = JSX.IntrinsicAttributes & {
  s3Configuration: S3ConfigurationContextValue;
  signInCSRFToken: string;
  signOutCSRFToken: string;
};

export type CSRFTokensContextValue = {
  signInCSRFToken: string;
  signOutCSRFToken: string;
};

export const CSRFTokensContext = React.createContext<CSRFTokensContextValue>({
  signInCSRFToken: '',
  signOutCSRFToken: '',
});

function AppRoot({ s3Configuration, signInCSRFToken, signOutCSRFToken }: AppRootProps): JSX.Element {
  return (
    <S3ConfigurationContext.Provider value={s3Configuration}>
      <CSRFTokensContext.Provider value={{ signInCSRFToken, signOutCSRFToken }}>
        <AppLayout>
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
      </CSRFTokensContext.Provider>
    </S3ConfigurationContext.Provider>
  );
}

export default AppRoot;
