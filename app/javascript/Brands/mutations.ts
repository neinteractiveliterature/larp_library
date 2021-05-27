import { gql } from '@apollo/client';
import { BrandMembershipFields, BrandPageBrandFields } from './queries';

export const CreateBrand = gql`
  mutation CreateBrand($brandAttributes: BrandAttributes!) {
    createBrand(input: { brandAttributes: $brandAttributes }) {
      brand {
        id
        ...BrandPageBrandFields
      }
    }
  }

  ${BrandPageBrandFields}
`;

export const UpdateBrand = gql`
  mutation UpdateBrand($id: ID!, $brandAttributes: BrandAttributes!) {
    updateBrand(input: { id: $id, brandAttributes: $brandAttributes }) {
      brand {
        id
        ...BrandPageBrandFields
      }
    }
  }

  ${BrandPageBrandFields}
`;

export const ApproveBrand = gql`
  mutation ApproveBrand($id: ID!) {
    approveBrand(input: { id: $id }) {
      brand {
        id
        ...BrandPageBrandFields
      }
    }
  }

  ${BrandPageBrandFields}
`;

export const InviteBrandMember = gql`
  mutation InviteBrandMember($brandId: ID!, $email: String!, $admin: Boolean!) {
    inviteBrandMember(input: { brandId: $brandId, email: $email, admin: $admin }) {
      brandMembership {
        ...BrandMembershipFields
      }
    }
  }

  ${BrandMembershipFields}
`;

export const DeleteBrandMembership = gql`
  mutation DeleteBrandMembership($id: ID!) {
    deleteBrandMembership(input: { id: $id }) {
      clientMutationId
    }
  }
`;
