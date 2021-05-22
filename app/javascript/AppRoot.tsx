import { mapValues } from 'lodash';
import React from 'react';
import { Route, Routes } from 'react-router';
import { S3ConfigurationContext, S3ConfigurationContextValue } from './S3ConfigurationContext';

const PageComponentImports: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [pageName: string]: () => Promise<{ default: React.ComponentType<any> }>;
} = {
  BrandPage: () => import('./Brands/BrandPage'),
  BrandListPage: () => import('./Brands/BrandListPage'),
  EditBrandPage: () => import('./Brands/EditBrandPage'),
  NewBrandPage: () => import('./Brands/NewBrandPage'),
  HomePage: () => import('./HomePage/HomePage'),
  ProjectRoot: () => import('./Project/ProjectRoot'),
  ProjectSearchPage: () => import('./ProjectSearch/ProjectSearchPage'),
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
      <Routes>
        <Route path="projects" element={<PageComponents.ProjectSearchPage />} />
        <Route path="brands/*">
          <Route path="new" element={<PageComponents.NewBrandPage />} />
          <Route path=":brandSlug/*">
            <Route path="edit" element={<PageComponents.EditBrandPage />} />
            <Route path="projects/*" element={<PageComponents.ProjectRoot />} />
            <Route path="/" element={<PageComponents.BrandPage />} />
          </Route>
          <Route path="/" element={<PageComponents.BrandListPage />} />
        </Route>
        <Route path="/" element={<PageComponents.HomePage />} />
      </Routes>
    </S3ConfigurationContext.Provider>
  );
}

export default AppRoot;
