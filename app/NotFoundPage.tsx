import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <>
      <h1>Page not found</h1>
      <p>
        We couldn&apos;t find anything at this address. Try the <Link to="/projects">larp list</Link> or go back to the{' '}
        <Link to="/">home page</Link>.
      </p>
    </>
  );
}
