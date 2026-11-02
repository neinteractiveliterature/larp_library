import { screen } from '@testing-library/react';

import AppLayout, { type AppLayoutData } from '~/components/AppLayout';
import { renderPage } from '../testUtils';

const noAbilities = {
  canApproveBrands: false,
  canCreateProjectPromotions: false,
  canUpdateTags: false,
  canUpdateTagCategories: false,
};

function layoutData(
  currentUser: { admin: boolean } | null,
  currentAbility: Partial<typeof noAbilities> = {},
): AppLayoutData {
  return { currentUser, currentAbility: { ...noAbilities, ...currentAbility } };
}

describe('AppLayout', () => {
  it('shows the navigation, the page, and a sign in button to anonymous visitors', () => {
    renderPage(
      <AppLayout data={layoutData(null)}>
        <p>The page content</p>
      </AppLayout>,
    );

    expect(screen.getByText('The page content')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Larps' })).toHaveAttribute('href', '/projects');
    expect(screen.getByRole('link', { name: 'Creators' })).toHaveAttribute('href', '/brands');
    expect(screen.getByRole('link', { name: 'Publish your larp' })).toHaveAttribute('href', '/brands/new');
    expect(screen.getByRole('link', { name: 'About us' })).toHaveAttribute('href', '/pages/about');
    expect(screen.getByRole('link', { name: 'Licensing' })).toHaveAttribute('href', '/pages/licensing');
    expect(screen.queryByRole('button', { name: 'Sign out' })).not.toBeInTheDocument();
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });

  it('links the sign in button to sign-in, returning to the current page', () => {
    renderPage(<AppLayout data={layoutData(null)}>content</AppLayout>, { route: '/projects?query=heist' });

    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      '/sign-in?returnTo=%2Fprojects%3Fquery%3Dheist',
    );
  });

  it('posts a sign out form for signed in users, without an admin menu for non-admins', () => {
    renderPage(<AppLayout data={layoutData({ admin: false })}>content</AppLayout>);

    const form = screen.getByRole('button', { name: 'Sign out' }).closest('form');
    expect(form).toHaveAttribute('action', '/sign-out');
    expect(form).toHaveAttribute('method', 'post');
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Sign in' })).not.toBeInTheDocument();
  });

  it('shows every admin menu entry to an admin with all abilities', () => {
    renderPage(
      <AppLayout
        data={layoutData(
          { admin: true },
          {
            canApproveBrands: true,
            canCreateProjectPromotions: true,
            canUpdateTags: true,
            canUpdateTagCategories: true,
          },
        )}
      >
        content
      </AppLayout>,
    );

    expect(screen.getByRole('link', { name: 'Pending Creators' })).toHaveAttribute('href', '/brands/unapproved');
    expect(screen.getByRole('link', { name: 'Promotions' })).toHaveAttribute('href', '/project_promotions');
    expect(screen.getByRole('link', { name: 'Tags' })).toHaveAttribute('href', '/tags');
    expect(screen.getByRole('link', { name: 'Tag Categories' })).toHaveAttribute('href', '/tag_categories');
  });

  it('only shows the admin menu entries the admin is allowed to use', () => {
    renderPage(<AppLayout data={layoutData({ admin: true }, { canUpdateTags: true })}>content</AppLayout>);

    expect(screen.getByRole('link', { name: 'Tags' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Pending Creators' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Promotions' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Tag Categories' })).not.toBeInTheDocument();
  });
});
