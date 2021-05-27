import { gql } from '@apollo/client';
import { ProjectPromotionFields } from './queries';

export const PromoteProjectMutation = gql`
  mutation PromoteProjectMutation($projectId: ID!) {
    promoteProject(input: { projectId: $projectId }) {
      projectPromotion {
        id
        ...ProjectPromotionFields
      }
    }
  }

  ${ProjectPromotionFields}
`;

export const UnpromoteProjectMutation = gql`
  mutation UnpromoteProjectMutation($projectId: ID!) {
    unpromoteProject(input: { projectId: $projectId }) {
      projectPromotion {
        id
        ...ProjectPromotionFields
      }
    }
  }

  ${ProjectPromotionFields}
`;
