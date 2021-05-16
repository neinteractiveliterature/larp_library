import { mapValues } from 'lodash';
import React from 'react';
import { Route, Routes } from 'react-router';
import { S3ConfigurationContext, S3ConfigurationContextValue } from './S3ConfigurationContext';

const PageComponentImports: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [pageName: string]: () => Promise<{ default: React.ComponentType<any> }>;
} = {
  HomePage: () => import('./HomePage/HomePage'),
  ProjectPage: () => import('./ProjectPage/ProjectPage'),
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
        <Route path="/brands/:brandId">
          <Route path="/projects/:projectId">
            <PageComponents.ProjectPage />
          </Route>
        </Route>
        <Route path="/">
          <PageComponents.HomePage />
        </Route>
      </Routes>
    </S3ConfigurationContext.Provider>
  );
}

export default AppRoot;
