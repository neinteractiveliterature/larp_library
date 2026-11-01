import type { ReactNode } from 'react';
import { Confirm, ErrorBoundary } from '@neinteractiveliterature/litform';

/** Everything the pages expect to find above them: the Confirm modal host, and an error boundary for the whole app */
export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary placement="replace">
      <Confirm>{children}</Confirm>
    </ErrorBoundary>
  );
}
