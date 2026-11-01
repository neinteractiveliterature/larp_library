import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as InvitationPage from './InvitationPage';
import { InvitationPageQueryDocument } from './queries.generated';
import { AcceptBrandMembershipInvitationDocument } from './mutations.generated';
import { SetReturnUrlDocument } from '../mutations.generated';
import { MockedResponse, renderRouteModule } from '../../../test/javascript/testUtils';

function invitationMock(options: { admin?: boolean; signedIn?: boolean } = {}): MockedResponse {
  const { admin = false, signedIn = true } = options;
  return {
    request: { query: InvitationPageQueryDocument, variables: { brandSlug: 'acme', invitationToken: 'tok123' } },
    maxUsageCount: Number.POSITIVE_INFINITY,
    result: {
      data: {
        brandMembership: {
          __typename: 'BrandMembership',
          id: 'm1',
          admin,
          brand: { __typename: 'Brand', id: 'b1', name: 'Acme Larps', slug: 'acme' },
        },
        currentUser: signedIn ? { __typename: 'User', id: 'u1' } : null,
      },
    },
  };
}

const renderInvitationPage = (mocks: MockedResponse[]) =>
  renderRouteModule(InvitationPage, {
    mocks,
    route: '/brands/acme/invitations/tok123',
    path: '/brands/:brandSlug/invitations/:invitationToken',
  });

describe('InvitationPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.querySelectorAll('body > form').forEach((form) => form.remove());
  });

  it('explains what a regular membership allows', async () => {
    renderInvitationPage([invitationMock()]);

    expect(await screen.findByRole('heading', { name: 'Welcome to Larp Library!' })).toBeInTheDocument();
    expect(screen.getByText('Publish larps as Acme Larps')).toBeInTheDocument();
    expect(screen.getByText('Edit existing Acme Larps larps')).toBeInTheDocument();
    expect(screen.queryByText(/Add and remove members/)).not.toBeInTheDocument();
  });

  it('explains the extra powers of an admin membership', async () => {
    renderInvitationPage([invitationMock({ admin: true })]);

    expect(await screen.findByText('Add and remove members from Acme Larps')).toBeInTheDocument();
    expect(screen.getByText('Edit the public description and branding for Acme Larps')).toBeInTheDocument();
  });

  it('accepts the invitation and goes to the brand page', async () => {
    const user = userEvent.setup();
    let accepted = false;
    renderInvitationPage([
      invitationMock(),
      {
        request: {
          query: AcceptBrandMembershipInvitationDocument,
          variables: { brandId: 'b1', invitationToken: 'tok123' },
        },
        result: () => {
          accepted = true;
          return { data: { acceptBrandMembershipInvitation: { __typename: 'Payload', clientMutationId: null } } };
        },
      },
    ]);

    await user.click(await screen.findByRole('button', { name: 'Accept invitation' }));

    await vi.waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/brands/acme'));
    expect(accepted).toBe(true);
  });

  it('shows the error if accepting fails', async () => {
    const user = userEvent.setup();
    renderInvitationPage([
      invitationMock(),
      {
        request: {
          query: AcceptBrandMembershipInvitationDocument,
          variables: { brandId: 'b1', invitationToken: 'tok123' },
        },
        error: new Error('invitation already used'),
      },
    ]);

    // InvitationPage doesn't catch the failed mutation, so the browser would log an unhandled rejection too.  That's
    // why the error message carries the marker that vitest.config.mts ignores.
    await user.click(await screen.findByRole('button', { name: 'Accept invitation' }));

    expect(await screen.findByText(/invitation already used/)).toBeInTheDocument();
  });

  it('asks anonymous visitors to sign in, then returns them here', async () => {
    const user = userEvent.setup();
    const submitted: string[] = [];
    vi.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation(function (this: HTMLFormElement) {
      submitted.push(this.getAttribute('action') ?? '');
    });
    let returnUrl: string | undefined;
    renderInvitationPage([
      invitationMock({ signedIn: false }),
      {
        request: { query: SetReturnUrlDocument },
        variableMatcher: () => true,
        result: (variables: { returnUrl: string }) => {
          returnUrl = variables.returnUrl;
          return { data: { setReturnUrl: { __typename: 'SetReturnUrlPayload', clientMutationId: null } } };
        },
      },
    ]);

    expect(screen.queryByRole('button', { name: 'Accept invitation' })).not.toBeInTheDocument();
    await user.click(await screen.findByRole('button', { name: 'Sign in to accept this invitation' }));

    await vi.waitFor(() => expect(submitted).toEqual(['/users/auth/intercode']));
    expect(returnUrl).toEqual('/brands/acme/invitations/tok123');
  });
});
