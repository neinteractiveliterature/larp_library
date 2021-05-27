/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
export type TagCategoryFragment = { __typename: 'TagCategory' } & Pick<
  Types.TagCategory,
  'id' | 'name' | 'color' | 'textColor' | 'icon'
>;

export const TagCategoryFragmentDoc = gql`
  fragment TagCategoryFragment on TagCategory {
    id
    name
    color
    textColor
    icon
  }
`;
