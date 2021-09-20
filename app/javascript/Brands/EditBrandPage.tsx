import {
  BootstrapFormCheckbox,
  BootstrapFormInput,
  addNewObjectToReferenceArrayUpdater,
  deleteObjectFromReferenceArrayUpdater,
  ErrorDisplay,
  LoadQueryWrapper,
  useGraphQLConfirm,
} from '@neinteractiveliterature/litform';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { generateBrandPath } from '../URLGenerators';
import BrandFormFields from './BrandFormFields';
import {
  useDeleteBrandMembershipMutation,
  useInviteBrandMemberMutation,
  useUpdateBrandMutation,
} from './mutations.generated';
import { BrandMembershipFieldsFragmentDoc, useEditBrandQuery } from './queries.generated';
import UnapprovedBrandAlert from './UnapprovedBrandAlert';

function useEditBrandQueryFromParams() {
  const { brandSlug } = useParams();
  return useEditBrandQuery({ variables: { slug: brandSlug } });
}

export default LoadQueryWrapper(useEditBrandQueryFromParams, function EditBrandPage({ data }) {
  const [brand, setBrand] = useState(data.brand);
  const [inviteUserEmail, setInviteUserEmail] = useState('');
  const [inviteUserAdmin, setInviteUserAdmin] = useState(false);
  const [inviteBrandMember, { loading: invitingBrandMember, error: inviteBrandMemberError }] =
    useInviteBrandMemberMutation();
  const [updateBrand, { loading: updatingBrand, error: updateBrandError }] =
    useUpdateBrandMutation();
  const [deleteBrandMembership] = useDeleteBrandMembershipMutation();
  const navigate = useNavigate();
  const confirm = useGraphQLConfirm();

  const saveSettings = async () => {
    await updateBrand({
      variables: {
        id: brand.id,
        brandAttributes: { name: brand.name, description: brand.description },
      },
    });
    navigate(generateBrandPath(brand));
  };

  const sendInvitation = async () => {
    await inviteBrandMember({
      variables: {
        brandId: data.brand.id,
        admin: inviteUserAdmin,
        email: inviteUserEmail,
      },
      update: addNewObjectToReferenceArrayUpdater(
        brand,
        'brandMemberships',
        (data) => data.inviteBrandMember?.brandMembership,
        BrandMembershipFieldsFragmentDoc,
      ),
    });

    setInviteUserAdmin(false);
    setInviteUserEmail('');
  };

  const removeMembership = async (membership: typeof data['brand']['brandMemberships'][number]) => {
    await deleteBrandMembership({
      variables: { id: membership.id },
      update: deleteObjectFromReferenceArrayUpdater(brand, 'brandMemberships', membership),
    });
  };

  return (
    <>
      <UnapprovedBrandAlert brand={brand} />

      <section className="mb-4">
        <h2>Settings</h2>
        <BrandFormFields brand={brand} onChange={setBrand} />
        <button
          type="button"
          className="btn btn-primary"
          onClick={saveSettings}
          disabled={updatingBrand}
        >
          Save changes
        </button>
        <ErrorDisplay graphQLError={updateBrandError} />
      </section>

      <hr className="mb-4" />

      <div className="membership">
        <h2>Membership</h2>
        <p>
          All members can create, edit and delete published projects. Admins can access this page.
        </p>
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
                      <i className="bi-envelope-fill" /> Invitation sent to{' '}
                      {membership.invitationEmail}
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
                  {data.brand.currentUserCanManageMemberships &&
                    membership.user?.id !== data.currentUser?.id && (
                      <button
                        type="button"
                        className="btn btn-danger"
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
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={sendInvitation}
                  disabled={invitingBrandMember}
                >
                  Send invitation
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>
                <ErrorDisplay graphQLError={inviteBrandMemberError} />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
});
