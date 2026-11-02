import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

// Bootstrap's JavaScript attaches to `document` as soon as it's imported, so it's loaded here (browser only) rather
// than in root.tsx, which is also run in Node to produce the static HTML shell.
import 'bootstrap/js/dist/alert';
import 'bootstrap/js/dist/dropdown';

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  );
});
