import { Suspense, type ComponentType } from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { MockedProvider, MockedResponse, MockLink } from '@apollo/client/testing';
import { render, RenderResult } from '@testing-library/react';
import { Confirm } from '@neinteractiveliterature/litform';
import {
  createMemoryRouter,
  MemoryRouter,
  Outlet,
  Route,
  RouterContextProvider,
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
import { appContext } from '../../app/javascript/appContext';
import RouteErrorDisplay from '../../app/javascript/RouteErrorDisplay';

import { typePolicies } from '../../app/javascript/larpLibraryApolloClient';
import { S3ConfigurationContext } from '../../app/javascript/S3ConfigurationContext';

export type { MockedResponse };

/** Renders the current URL (path, search and hash) so tests can assert on navigation */
export function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{`${location.pathname}${location.search}${location.hash}`}</div>;
}

export type RenderPageOptions = {
  /** Apollo mocks, in the order the page will request them (each mock is consumed once unless `maxUsageCount` is set) */
  mocks?: MockedResponse[];
  /** The URL to start at, including any query string */
  route?: string;
  /** The react-router path pattern the page is mounted at, e.g. "/brands/:brandSlug" */
  path?: string;
};

/**
 * Renders a page the way AppWrapper/AppRoot do (Apollo with the app's real cache type policies, router, Confirm,
 * Suspense, and the S3 context), but with the network replaced by the given Apollo mocks.
 */
export function renderPage(
  page: React.ReactElement,
  { mocks = [], route = '/', path = '*' }: RenderPageOptions = {},
): RenderResult {
  return render(
    <MockedProvider mocks={mocks} cache={new InMemoryCache({ typePolicies })}>
      <S3ConfigurationContext.Provider
        value={{ awsRegion: 'us-east-1', awsAccessKeyId: 'test-key-id', bucketName: 'test-bucket' }}
      >
        <Confirm>
          <MemoryRouter initialEntries={[route]}>
            <Suspense fallback={<div data-testid="suspense-fallback" />}>
              <Routes>
                <Route path={path} element={page} />
              </Routes>
            </Suspense>
            <LocationDisplay />
          </MemoryRouter>
        </Confirm>
      </S3ConfigurationContext.Provider>
    </MockedProvider>,
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

/** An Apollo client whose network is replaced by the given mocks, with the app's real cache type policies */
export function createMockApolloClient(mocks: MockedResponse[]) {
  return new ApolloClient({ link: new MockLink(mocks), cache: new InMemoryCache({ typePolicies }) });
}

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
  /** Apollo mocks, in the order the loaders and actions will request them */
  mocks?: MockedResponse[];
  /** The URL to start at */
  route?: string;
  /** The route pattern the module is mounted at, e.g. "/tags/:tagId/edit" (default: the path of `route`) */
  path?: string;
  /** Other routes the page's fetchers submit to, e.g. a route that has only a `clientAction` */
  extraRoutes?: { path: string; module: RouteModuleUnderTest }[];
};

/**
 * Renders a page the way the framework build does: its `clientLoader` and `clientAction` run against the Apollo mocks,
 * and its component gets `loaderData`, `actionData` and `params`.  Anywhere else in the app is an empty page, so a
 * redirect can be seen in the LocationDisplay.
 */
export function renderRouteModule(
  module: RouteModuleUnderTest,
  {
    mocks = [],
    route = '/',
    path = new URL(route, 'http://localhost').pathname,
    extraRoutes = [],
  }: RenderRouteModuleOptions = {},
): RenderResult {
  const apolloClient = createMockApolloClient(mocks);
  const config = {
    graphqlCSRFToken: 'graphql-token',
    s3Configuration: { awsRegion: 'us-east-1', awsAccessKeyId: 'test-key-id', bucketName: 'test-bucket' },
  };

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
    {
      initialEntries: [route],
      getContext: () => new RouterContextProvider(new Map([[appContext, { config, apolloClient }]])),
    },
  );

  return render(
    <ApolloProvider client={apolloClient}>
      <S3ConfigurationContext.Provider value={config.s3Configuration}>
        <Confirm>
          <RouterProvider router={router} />
        </Confirm>
      </S3ConfigurationContext.Provider>
    </ApolloProvider>,
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
