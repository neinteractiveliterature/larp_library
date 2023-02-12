import { gql } from '@apollo/client';

export const SetReturnUrl = gql`
  mutation SetReturnUrl($returnUrl: String!) {
    setReturnUrl(input: { returnUrl: $returnUrl }) {
      clientMutationId
    }
  }
`;
