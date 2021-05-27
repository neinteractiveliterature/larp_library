import { gql } from '@apollo/client';

// This has to be its own file because both Tags/queries.ts and TagCategories.ts reference it
export const TagCategoryFragment = gql`
  fragment TagCategoryFragment on TagCategory {
    id
    name
    color
    textColor
    icon
  }
`;
