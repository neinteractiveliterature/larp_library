import { isRouteErrorResponse } from 'react-router';
import NotFoundPage from './NotFoundPage';

/** What to show for an error thrown while loading or rendering a route */
export default function RouteErrorDisplay({ error }: { error: unknown }) {
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />;
  }

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`.trim() || 'Unexpected response'
    : error instanceof Error
      ? error.message
      : 'Unknown error';

  return (
    <>
      <h1>Something went wrong</h1>
      <p>{message}</p>
      <p>
        <a href="/">Go back to the home page</a>
      </p>
    </>
  );
}
