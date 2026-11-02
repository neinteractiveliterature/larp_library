import { BootstrapFormCheckbox, BootstrapFormInput, useConfirm } from '@neinteractiveliterature/litform';
import { useEffect, useState, type FormEvent } from 'react';
import { data, Form, redirect, useFetcher } from 'react-router';
import ActionErrorDisplay from '~/components/ActionErrorDisplay';
import { formatPageTitle } from '~/lib/pageTitle';
import { abilityContext, userContext } from '~/.server/lib/authContext';
import { removeBrandMembership, inviteBrandMember } from '~/.server/lib/brandMemberships.server';
import { findBrandForEditing, updateBrand } from '~/.server/lib/brands.server';
import { readDbContext } from '~/.server/lib/dbContext';
import { generateBrandPath } from '~/lib/URLGenerators';
import BrandFormFields from '~/components/brands/BrandFormFields';
import UnapprovedBrandAlert from '~/components/brands/UnapprovedBrandAlert';
import type { Route } from './+types/EditBrandPage';

export async function loader({ context, params }: Route.LoaderArgs) {
  const editing = await findBrandForEditing(context.get(readDbContext), context.get(abilityContext), params.brandSlug);
  return { ...editing, currentUserId: context.get(userContext)?.id ?? null };
}

export async function action({ context, params, request }: Route.ActionArgs) {
  const ability = context.get(abilityContext);
  const body = await request.json();

  // React Router reloads the page's data afterward, so new and removed memberships show up in the table
  switch (body.intent) {
    case 'save': {
      const result = await updateBrand(ability, body.brandId, body.brandAttributes);
      return result.ok
        ? redirect(generateBrandPath({ slug: params.brandSlug }))
        : data({ errors: result.errors }, { status: 422 });
    }
    case 'invite': {
      const result = await inviteBrandMember(ability, context.get(userContext), body.brandId, {
        email: body.email,
        admin: body.admin,
      });
      return result.ok ? { invited: true } : data({ errors: result.errors }, { status: 422 });
    }
    case 'removeMembership':
      await removeBrandMembership(ability, body.membershipId);
      return data(null);
    default:
      throw new Response(null, { status: 400, statusText: 'Bad Request' });
  }
}

const jsonPost = { method: 'post', encType: 'application/json' } as const;

export default function EditBrandPage({ loaderData }: Route.ComponentProps) {
  const [brand, setBrand] = useState(loaderData.brand);
  const [inviteUserEmail, setInviteUserEmail] = useState('');
  const [inviteUserAdmin, setInviteUserAdmin] = useState(false);
  const saveFetcher = useFetcher<typeof action>();
  const inviteFetcher = useFetcher<typeof action>();
  const removeFetcher = useFetcher<typeof action>();
  const confirm = useConfirm();

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
      { intent: 'invite', brandId: loaderData.brand.id, admin: inviteUserAdmin, email: inviteUserEmail },
      jsonPost,
    );
  };

  const removeMembership = async (membership: (typeof loaderData)['brandMemberships'][number]) => {
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
          <ActionErrorDisplay data={saveFetcher.data} />
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
              {loaderData.brandMemberships.map((membership) => (
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
                    {loaderData.brand.currentUserCanManageMemberships &&
                      membership.user?.id !== loaderData.currentUserId && (
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
                  <ActionErrorDisplay data={inviteFetcher.data} />
                  <ActionErrorDisplay data={removeFetcher.data} />
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
