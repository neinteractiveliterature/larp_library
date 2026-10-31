import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AppLayout from './AppLayout';
import { AppLayoutQueryDocument } from './queries.generated';
import { SetReturnUrlDocument } from './mutations.generated';
import { useSignIn } from './SignInButton';
import { MockedResponse, renderPage } from '../../test/javascript/testUtils';

const noAbilities = {
  __typename: 'Ability',
  canApproveBrands: false,
  canCreateProjectPromotions: false,
  canUpdateTags: false,
  canUpdateTagCategories: false,
};

function layoutMock(
  currentUser: { admin: boolean } | null,
  currentAbility: Partial<typeof noAbilities> = {},
): MockedResponse {
  return {
    request: { query: AppLayoutQueryDocument },
    result: {
      data: {
        currentUser: currentUser && { __typename: 'User', id: '1', ...currentUser },
        currentAbility: { ...noAbilities, ...currentAbility },
      },
    },
  };
}

describe('AppLayout', () => {
  let submittedForms: { action: string | null; fields: Record<string, FormDataEntryValue> }[];

  beforeEach(() => {
    submittedForms = [];
    // jsdom doesn't implement form submission; record what would have been posted instead
    vi.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation(function (this: HTMLFormElement) {
      submittedForms.push({ action: this.getAttribute('action'), fields: Object.fromEntries(new FormData(this)) });
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.querySelectorAll('form').forEach((form) => form.remove());
  });

  it('shows the navigation, the page, and a sign in button to anonymous visitors', async () => {
    renderPage(
      <AppLayout>
        <p>The page content</p>
      </AppLayout>,
      { mocks: [layoutMock(null)] },
    );

    expect(await screen.findByText('The page content')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Larps' })).toHaveAttribute('href', '/projects');
    expect(screen.getByRole('link', { name: 'Creators' })).toHaveAttribute('href', '/brands');
    expect(screen.getByRole('link', { name: 'Publish your larp' })).toHaveAttribute('href', '/brands/new');
    expect(screen.getByRole('link', { name: 'About us' })).toHaveAttribute('href', '/pages/about');
    expect(screen.getByRole('link', { name: 'Licensing' })).toHaveAttribute('href', '/pages/licensing');
    expect(screen.queryByRole('button', { name: 'Sign out' })).not.toBeInTheDocument();
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });

  it('posts a sign in form with the CSRF token', async () => {
    const user = userEvent.setup();
    renderPage(<AppLayout>content</AppLayout>, { mocks: [layoutMock(null)] });

    await user.click(await screen.findByRole('button', { name: 'Sign in' }));

    expect(submittedForms).toEqual([
      { action: '/users/auth/intercode', fields: { authenticity_token: 'sign-in-token' } },
    ]);
  });

  it('posts a DELETE sign out form for signed in users, without an admin menu for non-admins', async () => {
    const user = userEvent.setup();
    renderPage(<AppLayout>content</AppLayout>, { mocks: [layoutMock({ admin: false })] });

    await user.click(await screen.findByRole('button', { name: 'Sign out' }));

    expect(submittedForms).toEqual([
      { action: '/users/sign_out', fields: { authenticity_token: 'sign-out-token', _method: 'DELETE' } },
    ]);
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sign in' })).not.toBeInTheDocument();
  });

  it('shows every admin menu entry to an admin with all abilities', async () => {
    renderPage(<AppLayout>content</AppLayout>, {
      mocks: [
        layoutMock(
          { admin: true },
          {
            canApproveBrands: true,
            canCreateProjectPromotions: true,
            canUpdateTags: true,
            canUpdateTagCategories: true,
          },
        ),
      ],
    });

    expect(await screen.findByRole('link', { name: 'Pending Creators' })).toHaveAttribute('href', '/brands/unapproved');
    expect(screen.getByRole('link', { name: 'Promotions' })).toHaveAttribute('href', '/project_promotions');
    expect(screen.getByRole('link', { name: 'Tags' })).toHaveAttribute('href', '/tags');
    expect(screen.getByRole('link', { name: 'Tag Categories' })).toHaveAttribute('href', '/tag_categories');
  });

  it('only shows the admin menu entries the admin is allowed to use', async () => {
    renderPage(<AppLayout>content</AppLayout>, {
      mocks: [layoutMock({ admin: true }, { canUpdateTags: true })],
    });

    expect(await screen.findByRole('link', { name: 'Tags' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Pending Creators' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Promotions' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Tag Categories' })).not.toBeInTheDocument();
  });
});

describe('useSignIn', () => {
  function SignInWithReturn() {
    const signIn = useSignIn();
    return (
      <button type="button" onClick={() => signIn('/brands/acme/invitations/tok')}>
        Sign in and return
      </button>
    );
  }

  it('remembers where to come back to before sending the user off to sign in', async () => {
    const user = userEvent.setup();
    const submitted: string[] = [];
    vi.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation(function (this: HTMLFormElement) {
      submitted.push(this.getAttribute('action') ?? '');
    });
    let returnUrlSet = false;
    renderPage(<SignInWithReturn />, {
      mocks: [
        {
          request: { query: SetReturnUrlDocument, variables: { returnUrl: '/brands/acme/invitations/tok' } },
          result: () => {
            returnUrlSet = true;
            return { data: { setReturnUrl: { __typename: 'SetReturnUrlPayload', clientMutationId: null } } };
          },
        },
      ],
    });

    await user.click(screen.getByRole('button', { name: 'Sign in and return' }));

    await vi.waitFor(() => expect(submitted).toEqual(['/users/auth/intercode']));
    expect(returnUrlSet).toBe(true);
    vi.restoreAllMocks();
    document.querySelectorAll('form').forEach((form) => form.remove());
  });
});
