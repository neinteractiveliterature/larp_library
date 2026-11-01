import { Outlet } from 'react-router';
import AppLayout from './AppLayout';
import RouteErrorDisplay from './RouteErrorDisplay';
import type { Route } from './+types/AppLayoutRoute';

/** The layout route: the site header and footer around whichever page the URL matched */
export default function AppLayoutRoute() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

/** Errors from any page render inside the site header and footer rather than replacing the whole app */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <AppLayout>
      <RouteErrorDisplay error={error} />
    </AppLayout>
  );
}
