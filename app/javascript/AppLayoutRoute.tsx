import { Outlet } from 'react-router';
import AppLayout from './AppLayout';

/** The layout route: the site header and footer around whichever page the URL matched */
export default function AppLayoutRoute() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
