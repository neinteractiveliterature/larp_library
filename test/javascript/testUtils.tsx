import { Suspense, type ComponentType } from 'react';
import { render, RenderResult } from '@testing-library/react';
import { Confirm } from '@neinteractiveliterature/litform';
import {
  createMemoryRouter,
  MemoryRouter,
  Outlet,
  Route,
  RouterProvider,
  Routes,
  useActionData,
  useLoaderData,
  useLocation,
  useParams,
  useRouteError,
  useRouteLoaderData,
  type ActionFunction,
  type MiddlewareFunction,
  type LoaderFunction,
  type RouteObject,
} from 'react-router';
import RouteErrorDisplay from '~/RouteErrorDisplay';

/** Renders the current URL (path, search and hash) so tests can assert on navigation */
export function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{`${location.pathname}${location.search}${location.hash}`}</div>;
}

export type RenderPageOptions = {
  /** The URL to start at, including any query string */
  route?: string;
  /** The react-router path pattern the page is mounted at, e.g. "/brands/:brandSlug" */
  path?: string;
};

/** Renders a page the way the app does (inside a router, the Confirm modal host and Suspense), for components that need nothing else */
export function renderPage(
  page: React.ReactElement,
  { route = '/', path = '*' }: RenderPageOptions = {},
): RenderResult {
  return render(
    <Confirm>
      <MemoryRouter initialEntries={[route]}>
        <Suspense fallback={<div data-testid="suspense-fallback" />}>
          <Routes>
            <Route path={path} element={page} />
          </Routes>
        </Suspense>
        <LocationDisplay />
      </MemoryRouter>
    </Confirm>,
  );
}

/**
 * Opens a react-select (given its combobox input, e.g. from `screen.getByLabelText(...)`) and picks the option with the
 * given text.  Options that load asynchronously are awaited, so this works for AsyncSelect too.
 */
export async function selectReactSelectOption(
  user: ReturnType<typeof import('@testing-library/user-event').default.setup>,
  combobox: HTMLElement,
  optionText: string | RegExp,
  { typeText }: { typeText?: string } = {},
) {
  const { screen } = await import('@testing-library/react');
  await user.click(combobox);
  // selects that don't preload their options only show them once something has been typed
  if (typeText) {
    await user.type(combobox, typeText);
  } else {
    await user.keyboard('{ArrowDown}');
  }
  await user.click(await screen.findByText(optionText, { selector: '[class*="-menu"] *' }));
}

/** The parts of a route module (a page file) that the framework would wire up */
export type RouteModuleUnderTest = {
  // (a route with only actions, for fetchers to submit to, has no component)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default?: ComponentType<any>;
  clientLoader?: LoaderFunction;
  clientAction?: ActionFunction;
  clientMiddleware?: MiddlewareFunction[];
  // Server loaders and middleware only read the router context (the signed-in user and what they may do), so tests run
  // them like client ones, with those values supplied by the harness
  loader?: LoaderFunction;
  action?: ActionFunction;
  middleware?: MiddlewareFunction[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ErrorBoundary?: ComponentType<any>;
};

/** Passes a route module's component the same props the framework would (`loaderData`, `actionData`, `params`) */
function withRouteProps(module: RouteModuleUnderTest): ComponentType | undefined {
  const Page = module.default;
  if (!Page) {
    return undefined;
  }
  return function RouteComponent() {
    return <Page loaderData={useLoaderData()} actionData={useActionData()} params={useParams()} />;
  };
}

function withErrorBoundaryProps(module: RouteModuleUnderTest, id: string | undefined): ComponentType | undefined {
  const { ErrorBoundary } = module;
  if (!ErrorBoundary) {
    return undefined;
  }
  return function RouteErrorBoundary() {
    // like the framework, give the boundary the data its own route loaded (if that worked)
    const loaderData = useRouteLoaderData(id ?? '');
    return <ErrorBoundary error={useRouteError()} loaderData={loaderData} />;
  };
}

/** Turns a route module into a react-router route, the way the framework build does */
export function routeFromModule(
  module: RouteModuleUnderTest,
  props: { path?: string; index?: boolean; id?: string },
): RouteObject {
  return {
    ...props,
    Component: withRouteProps(module),
    ErrorBoundary: withErrorBoundaryProps(module, props.id),
    loader: module.clientLoader ?? module.loader,
    action: module.clientAction ?? module.action,
    middleware: module.clientMiddleware ?? module.middleware,
  } as RouteObject;
}

export type RenderRouteModuleOptions = {
  /** The URL to start at */
  route?: string;
  /** The route pattern the module is mounted at, e.g. "/tags/:tagId/edit" (default: the path of `route`) */
  path?: string;
  /** Other routes the page's fetchers submit to, e.g. a route that has only a `clientAction` */
  extraRoutes?: { path: string; module: RouteModuleUnderTest }[];
};

/**
 * Renders a page the way the framework build does: its loader and action run (they're given by the test, as stand-ins for
 * the server's), and its component gets `loaderData`, `actionData` and `params`.  Anywhere else in the app is an empty page, so a
 * redirect can be seen in the LocationDisplay.
 */
export function renderRouteModule(
  module: RouteModuleUnderTest,
  { route = '/', path = new URL(route, 'http://localhost').pathname, extraRoutes = [] }: RenderRouteModuleOptions = {},
): RenderResult {
  function Root() {
    return (
      <>
        <Outlet />
        <LocationDisplay />
      </>
    );
  }

  const router = createMemoryRouter(
    [
      {
        path: '/',
        Component: Root,
        children: [
          routeFromModule(module, { path }),
          ...extraRoutes.map((extra) => routeFromModule(extra.module, { path: extra.path })),
          { path: '*', Component: () => null },
        ],
      },
    ],
    { initialEntries: [route] },
  );

  return render(
    <Confirm>
      <RouterProvider router={router} />
    </Confirm>,
  );
}

/** The module, with an ErrorBoundary like the layout route's, so a failed loader or action shows its message */
export function withRouteErrorDisplay(module: RouteModuleUnderTest): RouteModuleUnderTest {
  return { ...module, ErrorBoundary: ({ error }: { error: unknown }) => <RouteErrorDisplay error={error} /> };
}

/**
 * Replaces `fetch` with one that answers requests for JSON (the pickers' autocomplete routes) from `answer`, which is given
 * the URL that was asked for. Restore it with `vi.restoreAllMocks()`.
 */
export function mockFetchJson(answer: (url: URL) => unknown) {
  return vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
    const url = new URL(
      typeof input === 'string' ? input : input instanceof URL ? input.href : input.url,
      'http://localhost',
    );
    return Response.json(answer(url));
  });
}

/**
 * A stand-in for a route's loader: it's handed the URL and params it was asked for, records the requests, and answers with
 * whatever the test decides.
 */
export function recordingLoader<TData>(answer: (url: URL, params: Record<string, string | undefined>) => TData) {
  const requests: URL[] = [];
  const loader = ({ request, params }: { request: Request; params: Record<string, string | undefined> }): TData => {
    const url = new URL(request.url);
    requests.push(url);
    return answer(url, params);
  };
  return { loader, requests };
}

/**
 * Replaces `fetch` with one that answers from `answer`, which is given the URL and options of each request and returns the JSON
 * to send back (and optionally a status). Restore it with `vi.restoreAllMocks()`.
 */
export function mockFetch(answer: (url: URL, init: RequestInit | undefined) => { body: unknown; status?: number }) {
  return vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
    const url = new URL(
      typeof input === 'string' ? input : input instanceof URL ? input.href : input.url,
      'http://localhost',
    );
    const { body, status = 200 } = answer(url, init);
    return Response.json(body, { status });
  });
}

/**
 * A stand-in for the browser's XMLHttpRequest, which the file upload uses to PUT a file to storage with progress. Each request
 * made is kept in `FakeXMLHttpRequest.requests`; by default it succeeds as soon as it's sent, or call `respond()` on it
 * yourself (after setting `FakeXMLHttpRequest.autoRespond = false`). Install it with `vi.stubGlobal`.
 */
export class FakeXMLHttpRequest {
  static requests: FakeXMLHttpRequest[] = [];
  static autoRespond = true;
  static status = 200;

  static reset() {
    FakeXMLHttpRequest.requests = [];
    FakeXMLHttpRequest.autoRespond = true;
    FakeXMLHttpRequest.status = 200;
  }

  method?: string;
  url?: string;
  headers: Record<string, string> = {};
  body?: unknown;
  status = 0;
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  upload: { onprogress: ((event: { lengthComputable: boolean; loaded: number; total: number }) => void) | null } = {
    onprogress: null,
  };

  open(method: string, url: string) {
    this.method = method;
    this.url = url;
  }

  setRequestHeader(name: string, value: string) {
    this.headers[name] = value;
  }

  send(body: unknown) {
    this.body = body;
    FakeXMLHttpRequest.requests.push(this);
    if (FakeXMLHttpRequest.autoRespond) {
      queueMicrotask(() => this.respond());
    }
  }

  progress(loaded: number, total: number) {
    this.upload.onprogress?.({ lengthComputable: true, loaded, total });
  }

  respond(status = FakeXMLHttpRequest.status) {
    this.status = status;
    this.onload?.();
  }

  failToConnect() {
    this.onerror?.();
  }
}
