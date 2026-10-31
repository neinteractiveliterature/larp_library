import { createHash } from 'node:crypto';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { MockLink, MockedResponse } from '@apollo/client/testing';
import type { HttpRequest } from '@aws-sdk/types';

import { createRequestSigner, createScope, hasHeader } from './uploadSigning';
import { SignRequestQueryDocument } from './queries.generated';

const PRESIGNED_URL =
  'https://test-bucket.s3.amazonaws.com/uploads/1/file.pdf?X-Amz-Signature=abc123&X-Amz-Date=20261031T120000Z';
const EMPTY_BODY_SHA256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

function sha256Hex(bytes: Uint8Array) {
  return createHash('sha256').update(bytes).digest('hex');
}

function buildClient(mock?: Partial<MockedResponse>) {
  const requests: { httpMethod: string; url: string; headers: Record<string, string> }[] = [];
  const link = new MockLink([
    {
      request: { query: SignRequestQueryDocument },
      variableMatcher: (variables) => {
        requests.push(variables as (typeof requests)[number]);
        return true;
      },
      result: { data: { presignS3Url: PRESIGNED_URL } },
      ...mock,
    },
  ]);
  return { client: new ApolloClient({ cache: new InMemoryCache(), link }), requests };
}

function buildRequest(overrides: Partial<HttpRequest> = {}): HttpRequest {
  return {
    method: 'PUT',
    protocol: 'https:',
    hostname: 'test-bucket.s3.amazonaws.com',
    path: '/uploads/1/file.pdf',
    headers: { host: 'test-bucket.s3.amazonaws.com', 'content-type': 'application/pdf' },
    query: {},
    ...overrides,
  };
}

describe('createRequestSigner', () => {
  it('hashes the body, has the server presign the request, and returns the presigned query parameters', async () => {
    const { client, requests } = buildClient();
    const body = new Uint8Array([1, 2, 3]);

    const signed = await createRequestSigner(client).sign(buildRequest({ body }));

    expect(signed.headers['X-Amz-Content-Sha256']).toEqual(sha256Hex(body));
    expect(signed.query).toEqual({ 'X-Amz-Signature': 'abc123', 'X-Amz-Date': '20261031T120000Z' });
    expect(requests).toEqual([
      {
        httpMethod: 'PUT',
        url: 'https://test-bucket.s3.amazonaws.com/uploads/1/file.pdf',
        headers: expect.objectContaining({
          'X-Amz-Content-Sha256': sha256Hex(body),
          'content-type': 'application/pdf',
        }),
      },
    ]);
  });

  it('hashes a string body', async () => {
    const { client } = buildClient();

    const signed = await createRequestSigner(client).sign(buildRequest({ body: 'hello' }));

    expect(signed.headers['X-Amz-Content-Sha256']).toEqual(sha256Hex(new TextEncoder().encode('hello')));
  });

  it('uses the well-known empty hash when there is no body', async () => {
    const { client } = buildClient();

    const signed = await createRequestSigner(client).sign(buildRequest());

    expect(signed.headers['X-Amz-Content-Sha256']).toEqual(EMPTY_BODY_SHA256);
  });

  it('signs streaming bodies with an unsigned payload, since they cannot be hashed', async () => {
    const { client } = buildClient();

    const signed = await createRequestSigner(client).sign(buildRequest({ body: { pipe: () => {} } }));

    expect(signed.headers['X-Amz-Content-Sha256']).toEqual('UNSIGNED-PAYLOAD');
  });

  it('keeps a content hash the caller already supplied', async () => {
    const { client } = buildClient();

    const signed = await createRequestSigner(client).sign(
      buildRequest({ body: new Uint8Array([9]), headers: { host: 'h', 'x-amz-content-sha256': 'precomputed' } }),
    );

    expect(signed.headers['x-amz-content-sha256']).toEqual('precomputed');
    expect(signed.headers['X-Amz-Content-Sha256']).toBeUndefined();
  });

  it('drops headers that the signature itself will carry, without modifying the original request', async () => {
    const { client, requests } = buildClient();
    const request = buildRequest({
      headers: { host: 'h', Authorization: 'old', 'X-Amz-Date': 'old', Date: 'old', 'content-type': 'text/plain' },
    });

    await createRequestSigner(client).sign(request);

    const sentHeaders = Object.keys(requests[0].headers).map((name) => name.toLowerCase());
    expect(sentHeaders).not.toContain('authorization');
    expect(sentHeaders).not.toContain('x-amz-date');
    expect(sentHeaders).not.toContain('date');
    expect(sentHeaders).toContain('content-type');
    expect(request.headers['Authorization']).toEqual('old');
  });

  it('fails if the server cannot presign the request', async () => {
    const { client } = buildClient({ result: undefined, error: new Error('not allowed') });

    await expect(createRequestSigner(client).sign(buildRequest())).rejects.toThrow(/not allowed/);
  });
});

describe('hasHeader', () => {
  it('finds headers regardless of case', () => {
    expect(hasHeader('Content-Type', { 'content-type': 'x' })).toBe(true);
    expect(hasHeader('content-type', { 'Content-Type': 'x' })).toBe(true);
    expect(hasHeader('x-other', { 'content-type': 'x' })).toBe(false);
  });
});

describe('createScope', () => {
  it('builds the credential scope string', () => {
    expect(createScope('20261031', 'us-east-1', 's3')).toEqual('20261031/us-east-1/s3/aws4_request');
  });
});
