import { PageLoadingIndicator } from '@neinteractiveliterature/litform';
import { Outlet, useNavigation } from 'react-router';
import AppLayout, { type AppLayoutData } from '~/components/AppLayout';
import RouteErrorDisplay from '~/components/RouteErrorDisplay';
import { abilityContext, userContext } from '~/server/lib/authContext';
import type { Route } from './+types/AppLayoutRoute';

export function loader({ context }: Route.LoaderArgs): AppLayoutData {
  const user = context.get(userContext);
  const ability = context.get(abilityContext);

  return {
    currentUser: user ? { admin: user.admin === true } : null,
    currentAbility: {
      canApproveBrands: ability.can('approve', 'Brand'),
      canCreateProjectPromotions: ability.can('create', 'ProjectPromotion'),
      canUpdateTags: ability.can('update', 'Tag'),
      canUpdateTagCategories: ability.can('update', 'TagCategory'),
    },
  };
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
