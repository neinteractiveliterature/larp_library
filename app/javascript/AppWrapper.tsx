import { ApolloProvider } from '@apollo/client';
import { Suspense, useRef, type JSX } from 'react';
import { Confirm, ErrorBoundary, PageLoadingIndicator } from '@neinteractiveliterature/litform';
import useLarpLibraryApolloClient from './useLarpLibraryApolloClient';
import { BrowserRouter } from 'react-router';

function AppWrapper<P extends JSX.IntrinsicAttributes>(
  WrappedComponent: React.ComponentType<P>,
): React.ComponentType<P> {
  type WrapperProps = P & { graphqlCSRFToken: string };
  const Wrapper = ({ graphqlCSRFToken, ...props }: WrapperProps) => {
    const onUnauthenticated = () => {
      // TODO: handle unauthenticated errors
    };
    const onUnauthenticatedRef = useRef(onUnauthenticated);
    const apolloClient = useLarpLibraryApolloClient(graphqlCSRFToken, onUnauthenticatedRef);

    if (!apolloClient) {
      // we need one render cycle to initialize the client
      return <></>;
    }

    return (
      <ErrorBoundary placement="replace">
        <Confirm>
          <ApolloProvider client={apolloClient}>
            <BrowserRouter>
              <Suspense fallback={<PageLoadingIndicator visible iconSet="bootstrap-icons" />}>
                <WrappedComponent {...(props as unknown as P)} />
              </Suspense>
            </BrowserRouter>
          </ApolloProvider>
        </Confirm>
      </ErrorBoundary>
    );
  };

  Wrapper.displayName = `AppWrapper<${WrappedComponent.displayName ?? 'unknown'}>`;

  return Wrapper;
}

export default AppWrapper;
