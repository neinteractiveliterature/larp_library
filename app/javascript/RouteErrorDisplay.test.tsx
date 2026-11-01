import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import RouteErrorDisplay from './RouteErrorDisplay';

function renderError(error: unknown) {
  return render(
    <MemoryRouter>
      <RouteErrorDisplay error={error} />
    </MemoryRouter>,
  );
}

// react-router's isRouteErrorResponse recognises the shape of a thrown `data()`/Response error
const routeErrorResponse = (status: number, statusText: string) => ({
  status,
  statusText,
  data: null,
  internal: false,
});

describe('RouteErrorDisplay', () => {
  it('shows the not-found page for a 404 response', () => {
    renderError(routeErrorResponse(404, 'Not Found'));

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  });

  it('shows the status of other error responses', () => {
    renderError(routeErrorResponse(500, 'Server Error'));

    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
    expect(screen.getByText('500 Server Error')).toBeInTheDocument();
  });

  it('shows the message of a thrown Error', () => {
    renderError(new Error('page exploded'));

    expect(screen.getByText('page exploded')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go back to the home page' })).toHaveAttribute('href', '/');
  });

  it('copes with something that is not an Error at all', () => {
    renderError('oops');

    expect(screen.getByText('Unknown error')).toBeInTheDocument();
  });
});
