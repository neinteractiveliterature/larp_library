import { PassThrough } from 'node:stream';

import { createReadableStreamFromReadable } from '@react-router/node';
import * as Sentry from '@sentry/react-router';
import { isbot } from 'isbot';
import type { RenderToPipeableStreamOptions } from 'react-dom/server';
import { renderToPipeableStream } from 'react-dom/server';
import type { EntryContext } from 'react-router';
import { isRouteErrorResponse, ServerRouter } from 'react-router';
import { env } from './server/env';

const sentryDebug = !!env.SENTRY_DEBUG_LOGGING;

// Sentry starts when this module loads, so it's ready before any request is handled, and only in the deployed function (where
// AWS_LAMBDA_FUNCTION_NAME is set): not in development or tests, which have no DSN worth reporting to.
if (env.SENTRY_DSN && env.AWS_LAMBDA_FUNCTION_NAME) {
  Sentry.init({ dsn: env.SENTRY_DSN, tracesSampleRate: 1.0, debug: sentryDebug });
}

export const streamTimeout = 5_000;

export async function handleError(error: unknown, { request }: { request: Request }) {
  // A request abandoned partway, because the visitor navigated away, is normal
  if (request.signal.aborted) {
    return;
  }

  // React Router reports "no route matched" as an error response, and a POST to a route with only a loader as 405. Those are
  // visitors and bots asking for things that aren't there, not bugs.
  if (isRouteErrorResponse(error) && (error.status === 404 || error.status === 405)) {
    return;
  }

  if (sentryDebug) {
    console.error('[handleError]', { url: request.url, method: request.method, error });
  }

  // React Router doesn't wait for this, so it can only queue the event; handleRequest sends it before the function freezes.
  Sentry.captureException(error, { mechanism: { type: 'react-router', handled: false } });
}

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  // https://httpwg.org/specs/rfc9110.html#HEAD
  if (request.method.toUpperCase() === 'HEAD') {
    return new Response(null, { status: responseStatusCode, headers: responseHeaders });
  }

  try {
    return await renderRequest(request, responseStatusCode, responseHeaders, routerContext);
  } finally {
    // The Lambda's execution context can end as soon as the response is ready, so send anything handleError queued first.
    await Sentry.flush(2000);
  }
}

function renderRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  return new Promise<Response>((resolve, reject) => {
    let shellRendered = false;
    const userAgent = request.headers.get('user-agent');

    // Bots (and so search engines) wait for all of the content, rather than the start of the page
    // https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
    const readyOption: keyof RenderToPipeableStreamOptions =
      userAgent && isbot(userAgent) ? 'onAllReady' : 'onShellReady';

    // Abort the rendering stream after the `streamTimeout` so it has time to flush down the rejected boundaries
    let timeoutId: ReturnType<typeof setTimeout> | undefined = setTimeout(() => abort(), streamTimeout + 1000);

    const { pipe, abort } = renderToPipeableStream(<ServerRouter context={routerContext} url={request.url} />, {
      [readyOption]() {
        shellRendered = true;
        const body = new PassThrough({
          final(callback) {
            // Clear the timeout to prevent retaining the closure and memory leak
            clearTimeout(timeoutId);
            timeoutId = undefined;
            callback();
          },
        });
        const stream = createReadableStreamFromReadable(body);

        responseHeaders.set('Content-Type', 'text/html');

        pipe(body);

        resolve(new Response(stream, { headers: responseHeaders, status: responseStatusCode }));
      },
      onShellError(error: unknown) {
        reject(error);
      },
      onError(error: unknown) {
        responseStatusCode = 500;
        // Log errors from streaming after the shell has gone out. Errors rendering the shell itself reject, and are reported
        // by handleError.
        if (shellRendered) {
          console.error(error);
        }
      },
    });
  });
}
