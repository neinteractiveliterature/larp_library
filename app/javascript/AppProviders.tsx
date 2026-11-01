import { ApolloProvider } from '@apollo/client';
import type { ReactNode } from 'react';
import { Confirm, ErrorBoundary } from '@neinteractiveliterature/litform';
import { CSRFTokensContext } from './CSRFTokensContext';
import { S3ConfigurationContext } from './S3ConfigurationContext';
import type { AppContextValue } from './appContext';

export type AppProvidersProps = AppContextValue & {
  children: ReactNode;
};

/** Everything the pages expect to find above them: Apollo, the S3/CSRF contexts, and the Confirm modal host */
export default function AppProviders({ config, apolloClient, children }: AppProvidersProps) {
  return (
    <ErrorBoundary placement="replace">
      <Confirm>
        <ApolloProvider client={apolloClient}>
          <S3ConfigurationContext.Provider value={config.s3Configuration}>
            <CSRFTokensContext.Provider
              value={{ signInCSRFToken: config.signInCSRFToken, signOutCSRFToken: config.signOutCSRFToken }}
            >
              {children}
            </CSRFTokensContext.Provider>
          </S3ConfigurationContext.Provider>
        </ApolloProvider>
      </Confirm>
    </ErrorBoundary>
  );
}
