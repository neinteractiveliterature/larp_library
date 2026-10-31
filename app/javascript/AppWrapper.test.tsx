import type { JSX } from 'react';
import { useApolloClient } from '@apollo/client';
import { render, screen } from '@testing-library/react';
import { useLocation } from 'react-router';

import AppWrapper from './AppWrapper';

// AppWrapper's props are the wrapped component's, plus the CSRF token it consumes
type TestProps = JSX.IntrinsicAttributes & { greeting?: string; graphqlCSRFToken?: string };

describe('AppWrapper', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  function Inner({ greeting }: TestProps) {
    // each of these only works if the wrapper provided the matching context
    const client = useApolloClient();
    const location = useLocation();
    return (
      <p>
        {greeting} from {location.pathname} ({client ? 'with apollo' : 'no apollo'})
      </p>
    );
  }

  it('wraps a page in Apollo, the router, and the other app-wide providers', async () => {
    const Wrapped = AppWrapper(Inner);

    render(<Wrapped graphqlCSRFToken="csrf-token" greeting="hello" />);

    expect(await screen.findByText('hello from / (with apollo)')).toBeInTheDocument();
  });

  it('consumes the CSRF token rather than passing it on to the wrapped component', async () => {
    const Wrapped = AppWrapper(function Echo(props: TestProps) {
      return <p>{`token=${props.graphqlCSRFToken ?? 'none'} greeting=${props.greeting}`}</p>;
    });

    render(<Wrapped graphqlCSRFToken="csrf-token" greeting="x" />);

    expect(await screen.findByText('token=none greeting=x')).toBeInTheDocument();
  });

  it('names the wrapper after the wrapped component, for debugging', () => {
    function Named(): JSX.Element {
      return <></>;
    }
    Named.displayName = 'NamedPage';
    function Anonymous(): JSX.Element {
      return <></>;
    }

    expect(AppWrapper(Named).displayName).toEqual('AppWrapper<NamedPage>');
    expect(AppWrapper(Anonymous).displayName).toEqual('AppWrapper<unknown>');
  });

  // litform's ErrorBoundary defaults to placement="before", which renders the children again after the error; if a
  // child threw while rendering, that re-render throws too and the error escapes.  AppWrapper asks for "replace".
  it('shows an error instead of a blank page when the wrapped component crashes', async () => {
    // React logs the error, re-reports it as a window "error" event in development, and litform's ErrorBoundary logs
    // it too; keep all of that from filling the test output
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
    // (capture phase + stopImmediatePropagation, so this runs ahead of vitest's own window error listener)
    const ignoreWindowError = (event: ErrorEvent) => {
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    window.addEventListener('error', ignoreWindowError, true);
    try {
      const Wrapped = AppWrapper(function Broken(props: TestProps): JSX.Element {
        if (props.greeting !== 'fine') {
          throw new Error('page exploded');
        }
        return <></>;
      });

      render(<Wrapped graphqlCSRFToken="csrf-token" />);

      expect(await screen.findByText(/page exploded/)).toBeInTheDocument();
    } finally {
      window.removeEventListener('error', ignoreWindowError, true);
    }
  });
});
