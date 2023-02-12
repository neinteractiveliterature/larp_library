/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
export type TagCategoryFragment = {
  __typename: 'TagCategory';
  id: string;
  name: string;
  color?: string | null;
  textColor?: string | null;
  icon?: string | null;
};

export const TagCategoryFragmentDoc = gql`
  fragment TagCategoryFragment on TagCategory {
    id
    name
    color
    textColor
    icon
  }
`;
