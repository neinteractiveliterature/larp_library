import { mapValues } from 'lodash';
import React from 'react';
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
  LicensingPage: () => import('./StaticPages/LicensingPage'),
  NewBrandPage: () => import('./Brands/NewBrandPage'),
  HomePage: () => import('./HomePage/HomePage'),
  InvitationPage: () => import('./Invitations/InvitationPage'),
  ProjectPromotionsPage: () => import('./ProjectPromotions/ProjectPromotionsPage'),
  ProjectRoot: () => import('./Project/ProjectRoot'),
  ProjectSearchPage: () => import('./ProjectSearch/ProjectSearchPage'),
  TagListPage: () => import('./Tags/TagListPage'),
  UnapprovedBrandsListPage: () => import('./Brands/UnapprovedBrandsListPage'),
};

const PageComponents = mapValues(PageComponentImports, (importFunction) =>
  React.lazy(importFunction),
);

export type AppRootProps = {
  s3Configuration: S3ConfigurationContextValue;
};

function AppRoot({ s3Configuration }: AppRootProps): JSX.Element {
  return (
    <S3ConfigurationContext.Provider value={s3Configuration}>
      <AppLayout>
        <Routes>
          <Route path="projects" element={<PageComponents.ProjectSearchPage />} />

          <Route path="brands/*">
            <Route path="unapproved" element={<PageComponents.UnapprovedBrandsListPage />} />
            <Route path="new" element={<PageComponents.NewBrandPage />} />

            <Route path=":brandSlug/*">
              <Route
                path="invitations/:invitationToken"
                element={<PageComponents.InvitationPage />}
              />
              <Route path="edit" element={<PageComponents.EditBrandPage />} />
              <Route path="projects/*" element={<PageComponents.ProjectRoot />} />
              <Route path="/" element={<PageComponents.BrandPage />} />
            </Route>

            <Route path="/" element={<PageComponents.BrandListPage />} />
          </Route>

          <Route path="project_promotions" element={<PageComponents.ProjectPromotionsPage />} />

          <Route path="tags/*">
            <Route path="/" element={<PageComponents.TagListPage />} />
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
