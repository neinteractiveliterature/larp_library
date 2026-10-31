import { gql } from '@apollo/client';
import { renderHook } from '@testing-library/react';

import useLarpLibraryApolloClient, { typePolicies } from './useLarpLibraryApolloClient';

const TestQuery = gql`
  query TestQuery {
    currentUser {
      id
    }
  }
`;

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json' } });
}

describe('useLarpLibraryApolloClient', () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('posts GraphQL queries to /graphql with the CSRF token and cookies', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ data: { currentUser: { __typename: 'User', id: '1' } } }));
    const { result } = renderHook(() => useLarpLibraryApolloClient('csrf-123', { current: () => {} }));

    const queryResult = await result.current.query({ query: TestQuery });

    expect(queryResult.data).toEqual({ currentUser: { __typename: 'User', id: '1' } });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toEqual('/graphql');
    expect(options?.method).toEqual('POST');
    expect(options?.credentials).toEqual('same-origin');
    expect(options?.headers).toMatchObject({ 'x-csrf-token': 'csrf-123' });
  });

  it('tells the app when a request is rejected as unauthenticated', async () => {
    const onUnauthenticated = vi.fn();
    fetchMock.mockResolvedValue(
      jsonResponse({ data: null, errors: [{ message: 'sign in first', extensions: { code: 'NOT_AUTHENTICATED' } }] }),
    );
    const { result } = renderHook(() => useLarpLibraryApolloClient('csrf', { current: onUnauthenticated }));

    await expect(result.current.query({ query: TestQuery, fetchPolicy: 'network-only' })).rejects.toThrow(
      /sign in first/,
    );

    expect(onUnauthenticated).toHaveBeenCalledTimes(1);
  });

  it('does not treat other errors as being signed out', async () => {
    const onUnauthenticated = vi.fn();
    fetchMock.mockResolvedValue(jsonResponse({ data: null, errors: [{ message: 'kaboom' }] }));
    const { result } = renderHook(() => useLarpLibraryApolloClient('csrf', { current: onUnauthenticated }));

    await expect(result.current.query({ query: TestQuery })).rejects.toThrow(/kaboom/);

    expect(onUnauthenticated).not.toHaveBeenCalled();
  });

  it('keeps the same client across renders', () => {
    const ref = { current: () => {} };
    const { result, rerender } = renderHook(() => useLarpLibraryApolloClient('csrf', ref));
    const firstClient = result.current;

    rerender();

    expect(result.current).toBe(firstClient);
  });

  it('paginates every connection the app pages through', () => {
    expect(Object.keys(typePolicies.Query?.fields ?? {}).sort()).toEqual([
      'brands',
      'projects',
      'tagCategories',
      'tags',
    ]);
  });
});
