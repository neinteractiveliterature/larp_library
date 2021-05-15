class HTTPResponseError extends Error {
  response: Response;

  constructor(response: Response) {
    super(`HTTP ${response.status} ${response.statusText}`);
    this.response = response;
  }
}

export default async function fetchJSON(
  input: RequestInfo,
  init?: RequestInit | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new HTTPResponseError(response);
  }

  const json = await response.json();
  return json;
}
