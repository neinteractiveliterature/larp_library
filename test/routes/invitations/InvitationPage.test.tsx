import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { data, redirect } from 'react-router';

import InvitationPage from '~/routes/invitations/InvitationPage';
import { renderRouteModule } from '../../testUtils';

function renderInvitationPage({
  admin = false,
  signedIn = true,
  respond = () => redirect('/brands/acme') as unknown,
}: { admin?: boolean; signedIn?: boolean; respond?: () => unknown } = {}) {
  const submitted: unknown[] = [];
  renderRouteModule(
    {
      default: InvitationPage,
      loader: () => ({
        brandMembership: { id: 7, admin, brand: { id: 5, name: 'Acme Larps', slug: 'acme' } },
        currentUser: signedIn ? { id: 1 } : null,
      }),
      action: async ({ request }: { request: Request }) => {
        submitted.push(await request.json());
        return respond();
      },
    },
    { route: '/brands/acme/invitations/tok123', path: '/brands/:brandSlug/invitations/:invitationToken' },
  );
  return { submitted };
}

describe('InvitationPage', () => {
  it('explains what a regular membership allows', async () => {
    renderInvitationPage();

    expect(await screen.findByRole('heading', { name: 'Welcome to Larp Library!' })).toBeInTheDocument();
    expect(screen.getByText('Publish larps as Acme Larps')).toBeInTheDocument();
    expect(screen.getByText('Edit existing Acme Larps larps')).toBeInTheDocument();
    expect(screen.queryByText(/Add and remove members/)).not.toBeInTheDocument();
  });

  it('explains the extra powers of an admin membership', async () => {
    renderInvitationPage({ admin: true });

    expect(await screen.findByText('Add and remove members from Acme Larps')).toBeInTheDocument();
    expect(screen.getByText('Edit the public description and branding for Acme Larps')).toBeInTheDocument();
  });

  it('accepts the invitation and goes to the brand page', async () => {
    const user = userEvent.setup();
    const { submitted } = renderInvitationPage();

    await user.click(await screen.findByRole('button', { name: 'Accept invitation' }));

    await vi.waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/brands/acme'));
    expect(submitted).toEqual([{ brandId: 5, brandSlug: 'acme', invitationToken: 'tok123' }]);
  });

  it('shows what the server says is wrong with accepting', async () => {
    const user = userEvent.setup();
    renderInvitationPage({
      respond: () => data({ errors: ['User is already a member of this brand'] }, { status: 422 }),
    });

    await user.click(await screen.findByRole('button', { name: 'Accept invitation' }));

    expect(await screen.findByText(/already a member of this brand/)).toBeInTheDocument();
  });

  it('asks anonymous visitors to sign in, then returns them here', async () => {
    renderInvitationPage({ signedIn: false });

    expect(screen.queryByRole('button', { name: 'Accept invitation' })).not.toBeInTheDocument();
    expect(await screen.findByRole('link', { name: 'Sign in to accept this invitation' })).toHaveAttribute(
      'href',
      '/sign-in?returnTo=%2Fbrands%2Facme%2Finvitations%2Ftok123',
    );
  });
});
