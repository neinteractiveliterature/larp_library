import { gql } from '@apollo/client';

export const AppLayoutQuery = gql`
  query AppLayoutQuery {
    currentUser {
      id
      admin
    }

    currentAbility {
      canApproveBrands
      canCreateProjectPromotions
      canUpdateTags
      canUpdateTagCategories
    }
  }
`;
