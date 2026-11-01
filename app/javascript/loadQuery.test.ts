import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { MockLink } from '@apollo/client/testing';
import { isRouteErrorResponse } from 'react-router';
import { loadQuery } from './loadQuery';

const TestQuery = gql`
  query TestQuery($id: ID!) {
    thing(id: $id) {
      id
    }
  }
`;

function clientWith(mock: ConstructorParameters<typeof MockLink>[0][number]) {
  return new ApolloClient({ link: new MockLink([mock]), cache: new InMemoryCache() });
}

describe('loadQuery', () => {
  it('returns the data', async () => {
    const client = clientWith({
      request: { query: TestQuery, variables: { id: '1' } },
      result: { data: { thing: { __typename: 'Thing', id: '1' } } },
    });

    expect(await loadQuery(client, TestQuery, { id: '1' })).toEqual({ thing: { __typename: 'Thing', id: '1' } });
  });

  it('asks the server even when the answer is already cached', async () => {
    const client = new ApolloClient({
      link: new MockLink([
        {
          request: { query: TestQuery, variables: { id: '1' } },
          maxUsageCount: 2,
          result: { data: { thing: { __typename: 'Thing', id: '1' } } },
        },
      ]),
      cache: new InMemoryCache(),
    });
    const spy = vi.spyOn(client, 'query');

    await loadQuery(client, TestQuery, { id: '1' });
    await loadQuery(client, TestQuery, { id: '1' });

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ fetchPolicy: 'network-only' }));
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('turns a NOT_FOUND error into a 404 response', async () => {
    const client = clientWith({
      request: { query: TestQuery, variables: { id: '2' } },
      result: { errors: [{ message: 'Thing not found', extensions: { code: 'NOT_FOUND' } } as never] },
    });

    const error = await loadQuery(client, TestQuery, { id: '2' }).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(Response);
    expect((error as Response).status).toEqual(404);
    expect(isRouteErrorResponse(error)).toBe(false); // (react-router wraps it into an error response when it catches it)
  });

  it('passes other errors along as they are', async () => {
    const client = clientWith({
      request: { query: TestQuery, variables: { id: '3' } },
      result: { errors: [{ message: 'kaboom' } as never] },
    });

    await expect(loadQuery(client, TestQuery, { id: '3' })).rejects.toThrow(/kaboom/);
  });
});
