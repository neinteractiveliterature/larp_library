import { useApolloClient } from '@apollo/client';
import { ErrorDisplay, LoadQueryWrapper } from '@neinteractiveliterature/litform';
import { useLocation, useNavigate, useParams } from 'react-router';
import { generateBrandPath } from '../URLGenerators';
import { useAcceptBrandMembershipInvitationMutation } from './mutations.generated';
import { useInvitationPageQuery } from './queries.generated';

function useInvitationPageQueryFromParams() {
  const { brandSlug, invitationToken } = useParams();
  if (invitationToken == null) {
    throw new Error('invitationToken param is required');
  }
  if (brandSlug == null) {
    throw new Error('brandSlug param is required');
  }

  return useInvitationPageQuery({
    variables: { brandSlug, invitationToken },
  });
}

export default LoadQueryWrapper(
  useInvitationPageQueryFromParams,
  function InvitationPage({ data }) {
    const brandName = data.brandMembership.brand.name;
    const location = useLocation();
    const [acceptBrandMembership, { loading, error }] =
      useAcceptBrandMembershipInvitationMutation();
    const { invitationToken } = useParams();
    const apolloClient = useApolloClient();
    const navigate = useNavigate();

    const acceptClicked = async () => {
      if (invitationToken == null) {
        throw new Error('invitationToken param is required');
      }
      await acceptBrandMembership({
        variables: {
          brandId: data.brandMembership.brand.id,
          invitationToken: invitationToken,
        },
      });

      navigate(generateBrandPath(data.brandMembership.brand));
      await apolloClient.resetStore();
    };

    return (
      <>
        <h1>Welcome to Larp Library!</h1>

        <p>
          Larp Library is a site for larp authors to publish their work under free-to-use licenses.
          You’ve been invited to join {brandName} on Larp Library.
        </p>

        <p>This membership allows you to:</p>

        <ul>
          <li>Publish larps as {brandName}</li>
          <li>Edit existing {brandName} larps</li>
          {data.brandMembership.admin && (
            <>
              <li>Add and remove members from {brandName}</li>
              <li>Edit the public description and branding for {brandName}</li>
            </>
          )}
        </ul>

        {data.currentUser ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={acceptClicked}
            disabled={loading}
          >
            Accept invitation
          </button>
        ) : (
          <a
            href={`/users/sign_in?user_return_to=${encodeURIComponent(location.pathname)}`}
            className="btn btn-primary"
          >
            Sign in to accept this invitation
          </a>
        )}

        <ErrorDisplay graphQLError={error} />
      </>
    );
  },
);
