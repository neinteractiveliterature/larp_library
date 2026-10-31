import { Suspense } from 'react';
import { InMemoryCache } from '@apollo/client';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, RenderResult } from '@testing-library/react';
import { Confirm } from '@neinteractiveliterature/litform';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';

import { typePolicies } from '../../app/javascript/useLarpLibraryApolloClient';
import { CSRFTokensContext } from '../../app/javascript/AppRoot';
import { S3ConfigurationContext } from '../../app/javascript/S3ConfigurationContext';

export type { MockedResponse };

/** Renders the current URL (path + search) so tests can assert on navigation */
export function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{`${location.pathname}${location.search}`}</div>;
}

export type RenderPageOptions = {
  /** Apollo mocks, in the order the page will request them (each mock is consumed once unless `maxUsageCount` is set) */
  mocks?: MockedResponse[];
  /** The URL to start at, including any query string */
  route?: string;
  /** The react-router path pattern the page is mounted at, e.g. "/brands/:brandSlug" */
  path?: string;
};

/**
 * Renders a page the way AppWrapper/AppRoot do (Apollo with the app's real cache type policies, router, Confirm,
 * Suspense, and the S3/CSRF contexts), but with the network replaced by the given Apollo mocks.
 */
export function renderPage(
  page: React.ReactElement,
  { mocks = [], route = '/', path = '*' }: RenderPageOptions = {},
): RenderResult {
  return render(
    <MockedProvider mocks={mocks} cache={new InMemoryCache({ typePolicies })}>
      <S3ConfigurationContext.Provider
        value={{ awsRegion: 'us-east-1', awsAccessKeyId: 'test-key-id', bucketName: 'test-bucket' }}
      >
        <CSRFTokensContext.Provider value={{ signInCSRFToken: 'sign-in-token', signOutCSRFToken: 'sign-out-token' }}>
          <Confirm>
            <MemoryRouter initialEntries={[route]}>
              <Suspense fallback={<div data-testid="suspense-fallback" />}>
                <Routes>
                  <Route path={path} element={page} />
                </Routes>
              </Suspense>
              <LocationDisplay />
            </MemoryRouter>
          </Confirm>
        </CSRFTokensContext.Provider>
      </S3ConfigurationContext.Provider>
    </MockedProvider>,
  );
}
