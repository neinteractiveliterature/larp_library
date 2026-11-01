import {
  BootstrapFormCheckbox,
  BootstrapFormInput,
  ErrorDisplay,
  useGraphQLConfirm,
} from '@neinteractiveliterature/litform';
import { useEffect, useState, type FormEvent } from 'react';
import { Form, redirect, useFetcher } from 'react-router';
import { appContext } from '../appContext';
import { loadQuery } from '../loadQuery';
import { getApolloActionError, withApolloErrors } from '../actionHelpers';
import type { BrandAttributes } from '../graphqlTypes.generated';
import { formatPageTitle } from '../pageTitle';
import { generateBrandPath } from '../URLGenerators';
import BrandFormFields from './BrandFormFields';
import { DeleteBrandMembershipDocument, InviteBrandMemberDocument, UpdateBrandDocument } from './mutations.generated';
import { EditBrandQueryDocument, type EditBrandQueryData, type EditBrandQueryVariables } from './queries.generated';
import UnapprovedBrandAlert from './UnapprovedBrandAlert';
import type { Route } from './+types/EditBrandPage';

export async function clientLoader({ context, params }: Route.ClientLoaderArgs) {
  const { apolloClient } = context.get(appContext);
  return loadQuery<EditBrandQueryData, EditBrandQueryVariables>(apolloClient, EditBrandQueryDocument, {
    slug: params.brandSlug,
  });
}

type EditBrandActionBody =
  | { intent: 'save'; brandId: string; brandAttributes: BrandAttributes }
  | { intent: 'invite'; brandId: string; email: string; admin: boolean }
  | { intent: 'removeMembership'; membershipId: string };

export async function clientAction({ context, params, request }: Route.ClientActionArgs) {
  const { apolloClient } = context.get(appContext);
  const body = (await request.json()) as EditBrandActionBody;

  // React Router reloads the page's data afterward, so new and removed memberships show up in the table
  return withApolloErrors(async () => {
    switch (body.intent) {
      case 'save':
        await apolloClient.mutate({
          mutation: UpdateBrandDocument,
          variables: { id: body.brandId, brandAttributes: body.brandAttributes },
        });
        return redirect(generateBrandPath({ slug: params.brandSlug }));
      case 'invite':
        await apolloClient.mutate({
          mutation: InviteBrandMemberDocument,
          variables: { brandId: body.brandId, admin: body.admin, email: body.email },
        });
        return { invited: true };
      case 'removeMembership':
        await apolloClient.mutate({ mutation: DeleteBrandMembershipDocument, variables: { id: body.membershipId } });
        return null;
    }
  });
}

const jsonPost = { method: 'post', encType: 'application/json' } as const;

export default function EditBrandPage({ loaderData: data }: Route.ComponentProps) {
  const [brand, setBrand] = useState(data.brand);
  const [inviteUserEmail, setInviteUserEmail] = useState('');
  const [inviteUserAdmin, setInviteUserAdmin] = useState(false);
  const saveFetcher = useFetcher<typeof clientAction>();
  const inviteFetcher = useFetcher<typeof clientAction>();
  const removeFetcher = useFetcher<typeof clientAction>();
  const confirm = useGraphQLConfirm();

  // once an invitation has gone through, clear the invitation fields for the next one
  useEffect(() => {
    if (inviteFetcher.state === 'idle' && inviteFetcher.data && 'invited' in inviteFetcher.data) {
      setInviteUserAdmin(false);
      setInviteUserEmail('');
    }
  }, [inviteFetcher.state, inviteFetcher.data]);

  const saveSettings = (event: FormEvent) => {
    event.preventDefault();
    saveFetcher.submit(
      {
        intent: 'save',
        brandId: brand.id,
        brandAttributes: { name: brand.name, description: brand.description ?? null },
      },
      jsonPost,
    );
  };

  const sendInvitation = (event: FormEvent) => {
    event.preventDefault();
    inviteFetcher.submit(
      { intent: 'invite', brandId: data.brand.id, admin: inviteUserAdmin, email: inviteUserEmail },
      jsonPost,
    );
  };

  const removeMembership = async (membership: (typeof data)['brand']['brandMemberships'][number]) => {
    await removeFetcher.submit({ intent: 'removeMembership', membershipId: membership.id }, jsonPost);
  };

  return (
    <>
      <UnapprovedBrandAlert brand={brand} />

      <section className="mb-4">
        <h2>Settings</h2>
        <Form method="post" onSubmit={saveSettings}>
          <BrandFormFields brand={brand} onChange={setBrand} />
          <button type="submit" className="btn btn-primary" disabled={saveFetcher.state !== 'idle'}>
            Save changes
          </button>
          <ErrorDisplay graphQLError={getApolloActionError(saveFetcher.data)} />
        </Form>
      </section>

      <hr className="mb-4" />

      <div className="membership">
        <h2>Membership</h2>
        <p>All members can create, edit and delete published projects. Admins can access this page.</p>
        <Form method="post" onSubmit={sendInvitation}>
          <table className="table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Admin?</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {data.brand.brandMemberships.map((membership) => (
                <tr key={membership.id}>
                  <td>
                    {membership.user ? (
                      <>{membership.user?.email}</>
                    ) : (
                      <>
                        <i className="bi-envelope-fill" /> Invitation sent to {membership.invitationEmail}
                      </>
                    )}
                  </td>
                  <td>
                    {membership.admin ? (
                      <>
                        <i className="bi-check" /> Admin
                      </>
                    ) : (
                      <>
                        <i className="bi-x" /> Not admin
                      </>
                    )}
                  </td>
                  <td className="text-end">
                    {data.brand.currentUserCanManageMemberships && membership.user?.id !== data.currentUser?.id && (
                      <button
                        type="button"
                        className="btn btn-danger"
                        disabled={removeFetcher.state !== 'idle'}
                        onClick={() =>
                          confirm({
                            action: () => removeMembership(membership),
                            prompt: `Are you sure you want to remove ${
                              membership.user?.email ?? membership.invitationEmail
                            }’s
                              membership from ${brand.name}?  This will revoke any privileges they
                              have on ${brand.name} projects.`,
                          })
                        }
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  <BootstrapFormInput
                    value={inviteUserEmail}
                    onTextChange={setInviteUserEmail}
                    label="Email to invite"
                    labelClassName="form-label visually-hidden"
                    type="email"
                  />
                </td>
                <td>
                  <BootstrapFormCheckbox
                    type="checkbox"
                    checked={inviteUserAdmin}
                    onCheckedChange={setInviteUserAdmin}
                    label="Admin?"
                  />
                </td>
                <td className="text-end">
                  <button type="submit" className="btn btn-success" disabled={inviteFetcher.state !== 'idle'}>
                    Send invitation
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}>
                  <ErrorDisplay graphQLError={getApolloActionError(inviteFetcher.data)} />
                  <ErrorDisplay graphQLError={getApolloActionError(removeFetcher.data)} />
                </td>
              </tr>
            </tfoot>
          </table>
        </Form>
      </div>
    </>
  );
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: formatPageTitle(loaderData ? `Editing ${loaderData.brand.name}` : 'Edit creator') }];
}
