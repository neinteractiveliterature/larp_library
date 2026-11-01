import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditorView } from '@codemirror/view';
import { data, redirect } from 'react-router';

import EditBrandPage from './EditBrandPage';
import NewBrandPage from './NewBrandPage';
import type { BrandEditingData } from '../server/lib/brands.server';
import { renderRouteModule } from '../../../test/javascript/testUtils';

function setDescription(text: string) {
  const view = EditorView.findFromDOM(document.querySelector('.cm-editor') as HTMLElement)!;
  // CodeMirror's update listener sets React state, so the dispatch has to happen inside act()
  act(() => view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } }));
}

/** The action stand-in tests give a page: it records the JSON the page submitted, and then does what the test asks */
type SubmittedBody = Record<string, unknown>;

function recordingAction(respond: (body: SubmittedBody) => unknown) {
  const submitted: SubmittedBody[] = [];
  const action = async ({ request }: { request: Request }) => {
    const body = await request.json();
    submitted.push(body);
    return respond(body);
  };
  return { action, submitted };
}

describe('NewBrandPage', () => {
  function renderNewBrandPage(
    currentUser: { name: string; brands: { id: number; name: string; slug: string }[] },
    action: ReturnType<typeof recordingAction>['action'] = recordingAction(() => redirect('/brands/pats-larps')).action,
  ) {
    return renderRouteModule(
      { default: NewBrandPage, loader: () => ({ currentUser }), action },
      { route: '/brands/new' },
    );
  }

  it('creates the brand and goes to its page', async () => {
    const user = userEvent.setup();
    const { action, submitted } = recordingAction(() => redirect('/brands/pats-larps'));
    renderNewBrandPage({ name: 'Pat', brands: [] }, action);

    expect(await screen.findByRole('heading', { name: 'Publish your larps' })).toBeInTheDocument();
    expect(screen.queryByText(/already signed up as a larp creator/)).not.toBeInTheDocument();
    await user.type(screen.getByLabelText('Name'), 'Pat’s Larps');
    await waitFor(() => expect(document.querySelector('.cm-editor')).toBeInTheDocument());
    setDescription('We make *larps*.');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/brands/pats-larps'));
    expect(submitted).toEqual([{ brandAttributes: { name: 'Pat’s Larps', description: 'We make *larps*.' } }]);
  });

  it('reminds people who already have brands, listing them in the order given', async () => {
    renderNewBrandPage({
      name: 'Pat',
      brands: [
        { id: 1, name: 'Acme Larps', slug: 'acme' },
        { id: 2, name: 'Zed Games', slug: 'zed' },
      ],
    });

    expect(await screen.findByText(/Hey Pat!/)).toBeInTheDocument();
    const links = within(
      screen.getByText(/Here are your current brands/).closest('.alert') as HTMLElement,
    ).getAllByRole('link');
    expect(links.map((link) => link.textContent)).toEqual(['Acme Larps', 'Zed Games']);
    expect(links[0]).toHaveAttribute('href', '/brands/acme');
  });

  it('shows what the server says is wrong, and stays on the page', async () => {
    const user = userEvent.setup();
    const { action } = recordingAction(() => data({ errors: ['Name has already been taken.'] }, { status: 422 }));
    renderNewBrandPage({ name: 'Pat', brands: [] }, action);

    await user.type(await screen.findByLabelText('Name'), 'Taken');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText(/Name has already been taken/)).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/brands/new');
  });
});

describe('EditBrandPage', () => {
  const member = (id: number, overrides: Partial<BrandEditingData['brandMemberships'][number]> = {}) => ({
    id,
    admin: false,
    invitationEmail: null,
    user: { id: 100 + id, name: `Member ${id}`, email: `m${id}@example.com` },
    ...overrides,
  });

  const initialMemberships = () => [
    member(1, { admin: true }),
    member(2),
    member(3, { user: null, invitationEmail: 'pending@example.com' }),
  ];

  /**
   * Renders the page with a stand-in for the server: the brand's memberships, and an action that records what was submitted
   * and changes them as the real one would (so React Router's reload afterward shows the change).
   */
  function renderEditBrandPage({
    canManage = true,
    approved = true,
    respond,
  }: { canManage?: boolean; approved?: boolean; respond?: (body: SubmittedBody) => unknown } = {}) {
    let memberships = initialMemberships();
    const { action, submitted } = recordingAction((body) => {
      if (respond) {
        return respond(body);
      }
      if (body.intent === 'removeMembership') {
        memberships = memberships.filter((m) => m.id !== body.membershipId);
        return data(null);
      }
      if (body.intent === 'invite') {
        memberships = [
          ...memberships,
          member(9, { user: null, invitationEmail: String(body.email), admin: body.admin === true }),
        ];
        return { invited: true };
      }
      return redirect('/brands/acme');
    });

    renderRouteModule(
      {
        default: EditBrandPage,
        loader: (): BrandEditingData & { currentUserId: number } => ({
          brand: {
            id: 5,
            name: 'Acme Larps',
            slug: 'acme',
            description: 'About Acme',
            approved,
            currentUserCanManageMemberships: canManage,
          },
          brandMemberships: memberships,
          currentUserId: 101,
        }),
        action,
      },
      { route: '/brands/acme/edit', path: '/brands/:brandSlug/edit' },
    );
    return { submitted };
  }

  it('lists the members, including pending invitations', async () => {
    renderEditBrandPage();

    expect(await screen.findByText('m1@example.com')).toBeInTheDocument();
    expect(screen.getByText('m2@example.com')).toBeInTheDocument();
    expect(screen.getByText(/Invitation sent to pending@example.com/)).toBeInTheDocument();
    expect(screen.getAllByText(/Not admin/)).toHaveLength(2);
    expect(screen.getByText(/Admin$/)).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('Acme Larps');
  });

  it('warns about unapproved brands', async () => {
    renderEditBrandPage({ approved: false });

    expect(await screen.findByText(/Acme Larps is pending approval/)).toBeInTheDocument();
  });

  it('lets you remove other members but not yourself', async () => {
    renderEditBrandPage();

    await screen.findByText('m1@example.com');
    const rows = screen.getAllByRole('row');
    const rowFor = (text: string) => rows.find((row) => row.textContent?.includes(text)) as HTMLElement;
    expect(within(rowFor('m1@example.com')).queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument();
    expect(within(rowFor('m2@example.com')).getByRole('button', { name: 'Remove' })).toBeInTheDocument();
    expect(within(rowFor('pending@example.com')).getByRole('button', { name: 'Remove' })).toBeInTheDocument();
  });

  it('hides the remove buttons from people who cannot manage memberships', async () => {
    renderEditBrandPage({ canManage: false });

    await screen.findByText('m1@example.com');
    expect(screen.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument();
  });

  it('removes a member after confirmation', async () => {
    const user = userEvent.setup();
    const { submitted } = renderEditBrandPage();

    await screen.findByText('m2@example.com');
    const row = screen.getAllByRole('row').find((r) => r.textContent?.includes('m2@example.com')) as HTMLElement;
    await user.click(within(row).getByRole('button', { name: 'Remove' }));
    expect(await screen.findByText(/remove m2@example.com’s/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'OK', hidden: true }));

    await waitFor(() => expect(screen.queryByText('m2@example.com')).not.toBeInTheDocument());
    expect(submitted).toEqual([{ intent: 'removeMembership', membershipId: 2 }]);
  });

  it('invites a new member, shows the invitation, and clears the form', async () => {
    const user = userEvent.setup();
    const { submitted } = renderEditBrandPage();

    await user.type(await screen.findByLabelText('Email to invite'), 'new@example.com');
    await user.click(screen.getByLabelText('Admin?'));
    await user.click(screen.getByRole('button', { name: 'Send invitation' }));

    expect(await screen.findByText(/Invitation sent to new@example.com/)).toBeInTheDocument();
    expect(submitted).toEqual([{ intent: 'invite', brandId: 5, admin: true, email: 'new@example.com' }]);
    await waitFor(() => expect(screen.getByLabelText('Email to invite')).toHaveValue(''));
    expect(screen.getByLabelText('Admin?')).not.toBeChecked();
  });

  it('shows what the server says is wrong with an invitation, and keeps what was typed', async () => {
    const user = userEvent.setup();
    renderEditBrandPage({ respond: () => data({ errors: ['Email is invalid'] }, { status: 422 }) });

    // (a real form: the browser itself rejects anything that isn't an email address, so the server's error is the next step)
    await user.type(await screen.findByLabelText('Email to invite'), 'bad@example.com');
    await user.click(screen.getByRole('button', { name: 'Send invitation' }));

    expect(await screen.findByText(/Email is invalid/)).toBeInTheDocument();
    expect(screen.getByLabelText('Email to invite')).toHaveValue('bad@example.com');
  });

  it('saves the brand settings and goes to the brand page', async () => {
    const user = userEvent.setup();
    const { submitted } = renderEditBrandPage();

    await user.type(await screen.findByLabelText('Name'), ' Ltd');
    await waitFor(() => expect(document.querySelector('.cm-editor')).toBeInTheDocument());
    setDescription('A new description');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/brands/acme'));
    expect(submitted).toEqual([
      { intent: 'save', brandId: 5, brandAttributes: { name: 'Acme Larps Ltd', description: 'A new description' } },
    ]);
  });

  it('shows what the server says is wrong with the settings', async () => {
    const user = userEvent.setup();
    renderEditBrandPage({ respond: () => data({ errors: ['Name has already been taken.'] }, { status: 422 }) });

    await user.type(await screen.findByLabelText('Name'), 'x');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(await screen.findByText(/Name has already been taken/)).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/brands/acme/edit');
  });
});
