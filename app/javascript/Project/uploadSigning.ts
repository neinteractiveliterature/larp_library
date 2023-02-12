import {
  HttpRequest,
  ChecksumConstructor,
  HashConstructor,
  HeaderBag,
  RequestSigner,
  QueryParameterBag,
} from '@aws-sdk/types';
import { toHex } from '@aws-sdk/util-hex-encoding';
import { toUint8Array } from '@aws-sdk/util-utf8';
import { isArrayBuffer } from '@aws-sdk/is-array-buffer';
import { Sha256 } from '@aws-crypto/sha256-browser';
import { formatUrl } from '@aws-sdk/util-format-url';
import { SignRequestQueryData, SignRequestQueryVariables } from './queries.generated';
import { ApolloClient } from '@apollo/client';
import { SignRequestQuery } from './queries';

// Most of this is adapted from the @aws-sdk/signature-v4 package source, but modified to do the actual signing
// on the server side

const SHA256_HEADER = 'X-Amz-Content-Sha256';
const UNSIGNED_PAYLOAD = 'UNSIGNED-PAYLOAD';
const AUTH_HEADER = 'authorization';
const AMZ_DATE_QUERY_PARAM = 'X-Amz-Date';
const AMZ_DATE_HEADER = AMZ_DATE_QUERY_PARAM.toLowerCase();
const DATE_HEADER = 'date';
const GENERATED_HEADERS = [AUTH_HEADER, AMZ_DATE_HEADER, DATE_HEADER];
const KEY_TYPE_IDENTIFIER = 'aws4_request';

const getPayloadHash = async (
  { headers, body }: HttpRequest,
  hashConstructor: ChecksumConstructor | HashConstructor,
): Promise<string> => {
  for (const headerName of Object.keys(headers)) {
    if (headerName.toLowerCase() === SHA256_HEADER) {
      return headers[headerName];
    }
  }

  if (body == undefined) {
    return 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  } else if (typeof body === 'string' || ArrayBuffer.isView(body) || isArrayBuffer(body)) {
    const hashCtor = new hashConstructor();
    hashCtor.update(toUint8Array(body));
    return toHex(await hashCtor.digest());
  }

  // As any defined body that is not a string or binary data is a stream, this
  // body is unsignable. Attempt to send the request with an unsigned payload,
  // which may or may not be accepted by the service.
  return UNSIGNED_PAYLOAD;
};

const cloneRequest = ({ headers, query, ...rest }: HttpRequest): HttpRequest => ({
  ...rest,
  headers: { ...headers },
  query: query ? cloneQuery(query) : undefined,
});

const cloneQuery = (query: QueryParameterBag): QueryParameterBag =>
  Object.keys(query).reduce((carry: QueryParameterBag, paramName: string) => {
    const param = query[paramName];
    return {
      ...carry,
      [paramName]: Array.isArray(param) ? [...param] : param,
    };
  }, {});

const prepareRequest = (request: HttpRequest): HttpRequest => {
  // Create a clone of the request object that does not clone the body
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request = typeof (request as any).clone === 'function' ? (request as any).clone() : cloneRequest(request);

  for (const headerName of Object.keys(request.headers)) {
    if (GENERATED_HEADERS.indexOf(headerName.toLowerCase()) > -1) {
      delete request.headers[headerName];
    }
  }

  return request;
};

export const hasHeader = (soughtHeader: string, headers: HeaderBag): boolean => {
  soughtHeader = soughtHeader.toLowerCase();
  for (const headerName of Object.keys(headers)) {
    if (soughtHeader === headerName.toLowerCase()) {
      return true;
    }
  }

  return false;
};

/**
 * Create a string describing the scope of credentials used to sign a request.
 *
 * @param shortDate The current calendar date in the form YYYYMMDD.
 * @param region    The AWS region in which the service resides.
 * @param service   The service to which the signed request is being sent.
 */
export const createScope = (shortDate: string, region: string, service: string): string =>
  `${shortDate}/${region}/${service}/${KEY_TYPE_IDENTIFIER}`;

export function createRequestSigner(apolloClient: ApolloClient<unknown>): RequestSigner {
  const requestSigner: RequestSigner = {
    async sign(requestToSign) {
      const request = prepareRequest(requestToSign);
      if (!hasHeader(SHA256_HEADER, request.headers)) {
        const payloadHash = await getPayloadHash(request, Sha256);
        request.headers[SHA256_HEADER] = payloadHash;
      }

      const result = await apolloClient.query<SignRequestQueryData, SignRequestQueryVariables>({
        query: SignRequestQuery,
        variables: {
          httpMethod: request.method,
          url: formatUrl(request),
          headers: request.headers,
        },
        fetchPolicy: 'no-cache',
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      const presignedURL = new URL(result.data.presignS3Url);
      request.query = Object.fromEntries(presignedURL.searchParams.entries());
      return request;
    },
  };

  return requestSigner;
}
