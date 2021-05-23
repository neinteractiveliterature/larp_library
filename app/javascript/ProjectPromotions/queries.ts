import { gql } from '@apollo/client';

export const ProjectPromotionFields = gql`
  fragment ProjectPromotionFields on ProjectPromotion {
    id
    createdAt

    project {
      id
      title

      brand {
        id
        slug
      }
    }
  }
`;

export const ProjectPromotionsPageQuery = gql`
  query ProjectPromotionsPageQuery {
    projectPromotions {
      id
      ...ProjectPromotionFields
    }
  }

  ${ProjectPromotionFields}
`;
