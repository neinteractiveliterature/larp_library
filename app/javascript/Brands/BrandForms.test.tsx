import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditorView } from '@codemirror/view';

import * as EditBrandPage from './EditBrandPage';
import * as NewBrandPage from './NewBrandPage';
import {
  CreateBrandDocument,
  DeleteBrandMembershipDocument,
  InviteBrandMemberDocument,
  UpdateBrandDocument,
} from './mutations.generated';
import { EditBrandQueryDocument, NewBrandQueryDocument } from './queries.generated';
import { buildBrand, resetFixtureIds } from '../../../test/javascript/fixtures';
import { MockedResponse, renderRouteModule } from '../../../test/javascript/testUtils';

function setDescription(text: string) {
  const view = EditorView.findFromDOM(document.querySelector('.cm-editor') as HTMLElement)!;
  // CodeMirror's update listener sets React state, so the dispatch has to happen inside act()
  act(() => view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } }));
}

function newBrandMock(currentUser: { name: string; brands: { id: string; name: string; slug: string }[] } | null) {
  return {
    request: { query: NewBrandQueryDocument },
    // React Router reloads the page's data after every action, so the query is asked again
    maxUsageCount: Number.POSITIVE_INFINITY,
    result: {
      data: {
        currentUser: currentUser && {
          __typename: 'User',
          id: 'u1',
          name: currentUser.name,
          brands: currentUser.brands.map((brand) => ({ __typename: 'Brand', ...brand })),
        },
      },
    },
  } satisfies MockedResponse;
}

describe('NewBrandPage', () => {
  beforeEach(() => resetFixtureIds());

  afterEach(() => {
    vi.restoreAllMocks();
    document.querySelectorAll('body > form').forEach((form) => form.remove());
  });

  it('creates the brand and goes to its page', async () => {
    const user = userEvent.setup();
    let sent: unknown;
    renderRouteModule(NewBrandPage, {
      route: '/brands/new',
      mocks: [
        newBrandMock({ name: 'Pat', brands: [] }),
        {
          request: { query: CreateBrandDocument },
          variableMatcher: () => true,
          result: (variables: unknown) => {
            sent = variables;
            return {
              data: {
                createBrand: {
                  __typename: 'CreateBrandPayload',
                  brand: buildBrand({ slug: 'pats-larps', name: 'Pat’s Larps' }),
                },
              },
            };
          },
        },
      ],
    });

    expect(await screen.findByRole('heading', { name: 'Publish your larps' })).toBeInTheDocument();
    expect(screen.queryByText(/already signed up as a larp creator/)).not.toBeInTheDocument();
    await user.type(screen.getByLabelText('Name'), 'Pat’s Larps');
    await waitFor(() => expect(document.querySelector('.cm-editor')).toBeInTheDocument());
    setDescription('We make *larps*.');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/brands/pats-larps'));
    expect(sent).toEqual({ brandAttributes: { name: 'Pat’s Larps', description: 'We make *larps*.' } });
  });

  it('reminds people who already have brands, listing them alphabetically', async () => {
    renderRouteModule(NewBrandPage, {
      route: '/brands/new',
      mocks: [
        newBrandMock({
          name: 'Pat',
          brands: [
            { id: 'b2', name: 'Zed Games', slug: 'zed' },
            { id: 'b1', name: 'Acme Larps', slug: 'acme' },
          ],
        }),
      ],
    });

    expect(await screen.findByText(/Hey Pat!/)).toBeInTheDocument();
    const links = within(
      screen.getByText(/Here are your current brands/).closest('.alert') as HTMLElement,
    ).getAllByRole('link');
    expect(links.map((link) => link.textContent)).toEqual(['Acme Larps', 'Zed Games']);
    expect(links[0]).toHaveAttribute('href', '/brands/acme');
  });

  it('shows the error if creating fails', async () => {
    const user = userEvent.setup();
    renderRouteModule(NewBrandPage, {
      route: '/brands/new',
      mocks: [
        newBrandMock({ name: 'Pat', brands: [] }),
        {
          request: { query: CreateBrandDocument },
          variableMatcher: () => true,
          error: new Error('name has already been taken'),
        },
      ],
    });

    await user.type(await screen.findByLabelText('Name'), 'Taken');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText(/name has already been taken/)).toBeInTheDocument();
  });
});

describe('EditBrandPage', () => {
  beforeEach(() => resetFixtureIds());

  const member = (id: string, overrides: Record<string, unknown> = {}) => ({
    __typename: 'BrandMembership',
    id,
    admin: false,
    invitationEmail: null,
    user: { __typename: 'User', id: `user-${id}`, name: `Member ${id}`, email: `${id}@example.com` },
    ...overrides,
  });

  function editBrandMock(
    options: { canManage?: boolean; approved?: boolean; memberships?: unknown[]; maxUsageCount?: number } = {},
  ): MockedResponse {
    const {
      canManage = true,
      approved = true,
      memberships = [
        member('m1', { admin: true }),
        member('m2'),
        member('m3', { user: null, invitationEmail: 'pending@example.com' }),
      ],
      // React Router reloads the page's data after every action, so the query is asked again
      maxUsageCount = Number.POSITIVE_INFINITY,
    } = options;
    return {
      request: { query: EditBrandQueryDocument, variables: { slug: 'acme' } },
      maxUsageCount,
      result: {
        data: {
          brand: {
            __typename: 'Brand',
            id: 'b1',
            approved,
            name: 'Acme Larps',
            slug: 'acme',
            description: 'About Acme',
            currentUserCanManageMemberships: canManage,
            brandMemberships: memberships,
          },
          currentUser: { __typename: 'User', id: 'user-m1' },
        },
      },
    };
  }

  const renderEditBrandPage = (mocks: MockedResponse[]) =>
    renderRouteModule(EditBrandPage, { mocks, route: '/brands/acme/edit', path: '/brands/:brandSlug/edit' });

  it('lists the members, including pending invitations', async () => {
    renderEditBrandPage([editBrandMock()]);

    expect(await screen.findByText('m1@example.com')).toBeInTheDocument();
    expect(screen.getByText('m2@example.com')).toBeInTheDocument();
    expect(screen.getByText(/Invitation sent to pending@example.com/)).toBeInTheDocument();
    expect(screen.getAllByText(/Not admin/)).toHaveLength(2);
    expect(screen.getByText(/Admin$/)).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('Acme Larps');
  });

  it('warns about unapproved brands', async () => {
    renderEditBrandPage([editBrandMock({ approved: false })]);

    expect(await screen.findByText(/Acme Larps is pending approval/)).toBeInTheDocument();
  });

  it('lets you remove other members but not yourself', async () => {
    renderEditBrandPage([editBrandMock()]);

    await screen.findByText('m1@example.com');
    const rows = screen.getAllByRole('row');
    const rowFor = (text: string) => rows.find((row) => row.textContent?.includes(text)) as HTMLElement;
    expect(within(rowFor('m1@example.com')).queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument();
    expect(within(rowFor('m2@example.com')).getByRole('button', { name: 'Remove' })).toBeInTheDocument();
    expect(within(rowFor('pending@example.com')).getByRole('button', { name: 'Remove' })).toBeInTheDocument();
  });

  it('hides the remove buttons from people who cannot manage memberships', async () => {
    renderEditBrandPage([editBrandMock({ canManage: false })]);

    await screen.findByText('m1@example.com');
    expect(screen.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument();
  });

  it('removes a member after confirmation', async () => {
    const user = userEvent.setup();
    let removed = false;
    renderEditBrandPage([
      editBrandMock({ maxUsageCount: 1 }),
      {
        request: { query: DeleteBrandMembershipDocument, variables: { id: 'm2' } },
        result: () => {
          removed = true;
          return { data: { deleteBrandMembership: { __typename: 'Payload', clientMutationId: null } } };
        },
      },
      // the reload after the removal
      editBrandMock({
        memberships: [
          member('m1', { admin: true }),
          member('m3', { user: null, invitationEmail: 'pending@example.com' }),
        ],
      }),
    ]);

    await screen.findByText('m2@example.com');
    const row = screen.getAllByRole('row').find((r) => r.textContent?.includes('m2@example.com')) as HTMLElement;
    await user.click(within(row).getByRole('button', { name: 'Remove' }));
    expect(await screen.findByText(/remove m2@example.com’s/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'OK', hidden: true }));

    await waitFor(() => expect(removed).toBe(true));
    await waitFor(() => expect(screen.queryByText('m2@example.com')).not.toBeInTheDocument());
  });

  it('invites a new member and clears the form', async () => {
    const user = userEvent.setup();
    let sent: unknown;
    renderEditBrandPage([
      editBrandMock(),
      {
        request: { query: InviteBrandMemberDocument },
        variableMatcher: () => true,
        result: (variables: unknown) => {
          sent = variables;
          return {
            data: {
              inviteBrandMember: {
                __typename: 'InviteBrandMemberPayload',
                brandMembership: member('m9', { user: null, invitationEmail: 'new@example.com', admin: true }),
              },
            },
          };
        },
      },
    ]);

    await user.type(await screen.findByLabelText('Email to invite'), 'new@example.com');
    await user.click(screen.getByLabelText('Admin?'));
    await user.click(screen.getByRole('button', { name: 'Send invitation' }));

    await waitFor(() => expect(sent).toEqual({ brandId: 'b1', admin: true, email: 'new@example.com' }));
    await waitFor(() => expect(screen.getByLabelText('Email to invite')).toHaveValue(''));
    expect(screen.getByLabelText('Admin?')).not.toBeChecked();
  });

  it('shows the error if the invitation fails', async () => {
    const user = userEvent.setup();
    renderEditBrandPage([
      editBrandMock(),
      {
        request: { query: InviteBrandMemberDocument },
        variableMatcher: () => true,
        error: new Error('email is invalid'),
      },
    ]);

    // (a real form: the browser itself rejects anything that isn't an email address, so the server's error is the next step)
    await user.type(await screen.findByLabelText('Email to invite'), 'taken@example.com');
    await user.click(screen.getByRole('button', { name: 'Send invitation' }));

    expect(await screen.findByText(/email is invalid/)).toBeInTheDocument();
  });

  it('saves the brand settings and goes to the brand page', async () => {
    const user = userEvent.setup();
    let sent: unknown;
    renderEditBrandPage([
      editBrandMock(),
      {
        request: { query: UpdateBrandDocument },
        variableMatcher: () => true,
        result: (variables: unknown) => {
          sent = variables;
          return {
            data: { updateBrand: { __typename: 'UpdateBrandPayload', brand: buildBrand({ id: 'b1', slug: 'acme' }) } },
          };
        },
      },
    ]);

    await user.type(await screen.findByLabelText('Name'), ' Ltd');
    await waitFor(() => expect(document.querySelector('.cm-editor')).toBeInTheDocument());
    setDescription('A new description');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/brands/acme'));
    expect(sent).toEqual({ id: 'b1', brandAttributes: { name: 'Acme Larps Ltd', description: 'A new description' } });
  });
});
