/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { TagFragment } from '../Tags/queries.generated';
import { gql } from '@apollo/client';
import { TagFragmentDoc } from '../Tags/queries.generated';
export type ProjectHeadersFragment = (
  { __typename: 'Project' }
  & Pick<Types.Project, 'id' | 'title' | 'authors' | 'minPlayers' | 'maxPlayers' | 'publicationYear' | 'lengthQuantity' | 'lengthUnits'>
  & { brand: (
    { __typename: 'Brand' }
    & Pick<Types.Brand, 'id' | 'name' | 'slug'>
  ), tags: Array<(
    { __typename: 'Tag' }
    & Pick<Types.Tag, 'id'>
    & TagFragment
  )> }
);

export const ProjectHeadersFragmentDoc = gql`
    fragment ProjectHeadersFragment on Project {
  id
  title
  authors
  minPlayers
  maxPlayers
  publicationYear
  lengthQuantity
  lengthUnits
  brand {
    id
    name
    slug
  }
  tags {
    id
    ...TagFragment
  }
}
    ${TagFragmentDoc}`;