// @vitest-environment node
import * as Sentry from '@sentry/react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleError } from './entry.server';

vi.mock('@sentry/react-router', () => ({ init: vi.fn(), captureException: vi.fn(), flush: vi.fn() }));

describe('handleError', () => {
  afterEach(() => vi.clearAllMocks());

  const request = (aborted = false) => ({
    request: { signal: { aborted }, url: 'http://x.test/', method: 'GET' } as Request,
  });
  // what React Router gives handleError for a URL no route matches (or a verb a route doesn't take)
  const errorResponse = (status: number) => ({ status, statusText: '', internal: true, data: null });

  it('reports an unexpected error', async () => {
    const error = new Error('boom');

    await handleError(error, request());

    expect(Sentry.captureException).toHaveBeenCalledWith(error, {
      mechanism: { type: 'react-router', handled: false },
    });
  });

  it('does not report a request the visitor abandoned', async () => {
    await handleError(new Error('aborted'), request(true));

    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it.each([404, 405])('does not report a routine %i', async (status) => {
    await handleError(errorResponse(status), request());

    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it('does report other error responses', async () => {
    await handleError(new Response(null, { status: 500 }), request());

    expect(Sentry.captureException).toHaveBeenCalled();
  });
});
