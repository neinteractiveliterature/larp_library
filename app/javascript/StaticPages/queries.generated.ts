/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { LicenseFieldsFragment } from '../Project/queries.generated';
import { gql } from '@apollo/client';
import { LicenseFieldsFragmentDoc } from '../Project/queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type LicensingPageQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type LicensingPageQueryData = (
  { __typename: 'Query' }
  & { licenses: Array<(
    { __typename: 'License' }
    & Pick<Types.License, 'id'>
    & LicenseFieldsFragment
  )> }
);


export const LicensingPageQueryDocument = gql`
    query LicensingPageQuery {
  licenses {
    id
    ...LicenseFieldsFragment
  }
}
    ${LicenseFieldsFragmentDoc}`;

/**
 * __useLicensingPageQuery__
 *
 * To run a query within a React component, call `useLicensingPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useLicensingPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLicensingPageQuery({
 *   variables: {
 *   },
 * });
 */
export function useLicensingPageQuery(baseOptions?: Apollo.QueryHookOptions<LicensingPageQueryData, LicensingPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LicensingPageQueryData, LicensingPageQueryVariables>(LicensingPageQueryDocument, options);
      }
export function useLicensingPageQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LicensingPageQueryData, LicensingPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LicensingPageQueryData, LicensingPageQueryVariables>(LicensingPageQueryDocument, options);
        }
export type LicensingPageQueryHookResult = ReturnType<typeof useLicensingPageQuery>;
export type LicensingPageQueryLazyQueryHookResult = ReturnType<typeof useLicensingPageQueryLazyQuery>;
export type LicensingPageQueryQueryResult = Apollo.QueryResult<LicensingPageQueryData, LicensingPageQueryVariables>;