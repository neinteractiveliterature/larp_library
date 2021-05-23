import { gql } from '@apollo/client';

export const AppLayoutQuery = gql`
  query AppLayoutQuery {
    currentUser {
      id
      admin
    }

    currentAbility {
      canCreateProjectPromotions
      canUpdateTags
      canUpdateTagCategories
    }
  }
`;
