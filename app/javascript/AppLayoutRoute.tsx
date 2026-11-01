import { PageLoadingIndicator } from '@neinteractiveliterature/litform';
import { Outlet, useNavigation } from 'react-router';
import AppLayout from './AppLayout';
import { appContext } from './appContext';
import { AppLayoutQueryDocument, type AppLayoutQueryData, type AppLayoutQueryVariables } from './queries.generated';
import RouteErrorDisplay from './RouteErrorDisplay';
import type { Route } from './+types/AppLayoutRoute';

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const { apolloClient } = context.get(appContext);
  const { data } = await apolloClient.query<AppLayoutQueryData, AppLayoutQueryVariables>({
    query: AppLayoutQueryDocument,
    fetchPolicy: 'network-only',
  });
  return data;
}

/** The layout route: the site header and footer around whichever page the URL matched */
export default function AppLayoutRoute({ loaderData }: Route.ComponentProps) {
  const navigation = useNavigation();

  return (
    <AppLayout data={loaderData}>
      {/* the old page stays up while the next one's code and data load */}
      <PageLoadingIndicator visible={navigation.state === 'loading'} iconSet="bootstrap-icons" />
      <Outlet />
    </AppLayout>
  );
}

/**
 * Errors from a page render inside the site header and footer.  (If the layout's own data failed to load there's no
 * navigation to show, so it's just the error.)
 */
export function ErrorBoundary({ error, loaderData }: Route.ErrorBoundaryProps) {
  const errorDisplay = <RouteErrorDisplay error={error} />;

  return loaderData ? (
    <AppLayout data={loaderData}>{errorDisplay}</AppLayout>
  ) : (
    <div className="container">{errorDisplay}</div>
  );
}
