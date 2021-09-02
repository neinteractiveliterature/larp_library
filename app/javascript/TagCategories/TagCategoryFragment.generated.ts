/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
export type TagCategoryFragment = {
  __typename: 'TagCategory';
  id: string;
  name: string;
  color?: Types.Maybe<string>;
  textColor?: Types.Maybe<string>;
  icon?: Types.Maybe<string>;
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
