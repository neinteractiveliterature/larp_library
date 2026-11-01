import { gql } from '@apollo/client';
import { createLarpLibraryApolloClient, typePolicies } from './larpLibraryApolloClient';

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

describe('createLarpLibraryApolloClient', () => {
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
    const client = createLarpLibraryApolloClient('csrf-123');

    const queryResult = await client.query({ query: TestQuery });

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
    const client = createLarpLibraryApolloClient('csrf', onUnauthenticated);

    await expect(client.query({ query: TestQuery, fetchPolicy: 'network-only' })).rejects.toThrow(/sign in first/);

    expect(onUnauthenticated).toHaveBeenCalledTimes(1);
  });

  it('does not treat other errors as being signed out', async () => {
    const onUnauthenticated = vi.fn();
    fetchMock.mockResolvedValue(jsonResponse({ data: null, errors: [{ message: 'kaboom' }] }));
    const client = createLarpLibraryApolloClient('csrf', onUnauthenticated);

    await expect(client.query({ query: TestQuery })).rejects.toThrow(/kaboom/);

    expect(onUnauthenticated).not.toHaveBeenCalled();
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
