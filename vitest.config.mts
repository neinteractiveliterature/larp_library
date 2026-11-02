import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

function absolutePath(relativePath: string) {
  return fileURLToPath(new URL(relativePath, import.meta.url));
}

// Deliberately separate from vite.config.mts: tests don't need the React Router plugin or its build hooks
export default defineConfig({
  plugins: [react()],
  resolve: {
    // "~/" is the app's code (app/), so tests don't need long relative paths up to it; see tsconfig.json
    alias: [{ find: /^~\//, replacement: absolutePath('./app/') }],
  },
  test: {
    coverage: {
      enabled: process.env['COVERAGE'] ? true : false,
      include: ['app/**/*.{ts,tsx}'],
      exclude: [
        // ambient type declarations
        'app/@types/**',
        // the browser entry point, which hydrates the page as soon as it's imported
        'app/entry.client.tsx',
      ],
      reportsDirectory: absolutePath('./coverage'),
      reporter: ['text', 'cobertura', 'html'],
      reportOnFailure: true,
    },
    // Some page code awaits a mutation without catching a failure, which is an unhandled rejection in the browser (see
    // InvitationPage).  Vitest fails the whole run on those, even when every test passed.  Tests that deliberately
    // exercise such a path throw an error whose message contains the marker below; anything else still fails the run.
    onUnhandledError(error) {
      try {
        if (JSON.stringify(error).includes('[expected unhandled]')) {
          return false;
        }
      } catch {
        // fall through: report errors we can't inspect
      }
      return undefined;
    },
    environment: 'jsdom',
    // Placeholder values for the server code's env validation (app/.server/env.ts). The database pool connects
    // lazily, so nothing here is ever contacted; tests that need a real database set one up themselves.
    env: {
      // The Postgres server the database tests run against (each test worker makes its own database on it; see
      // test/server/support/db.ts). Set TEST_DATABASE_URL to use a different one.
      TEST_DATABASE_URL: process.env['TEST_DATABASE_URL'] ?? 'postgres://postgres@localhost/larp_library_test',
      DATABASE_URL: 'postgres://localhost/larp_library_test',
      APP_URL_BASE: 'http://localhost:3042',
      AWS_S3_BUCKET: 'test-bucket',
      BETTER_AUTH_SECRET: 'test-secret-test-secret-test-secret-12',
      INTERCODE_URL: 'https://intercode.test',
      INTERCODE_APP_ID: 'test-app-id',
      INTERCODE_APP_SECRET: 'test-app-secret',
    },
    globals: true,
    setupFiles: [absolutePath('./test/setupTests.ts')],
    include: ['test/**/*.test.{ts,tsx}'],
    testTimeout: 10000,
    reporters: [
      'default',
      ['junit', { outputFile: absolutePath('./test/reports/TEST-vitest.xml') }],
      ['html', { outputDir: absolutePath('./test/html_reports/vitest') }],
    ],
    server: {
      deps: {
        // The Testing Library packages have to be processed together so that they all share one copy of
        // @testing-library/dom.  Otherwise user-event ends up with its own copy, which React Testing Library hasn't
        // configured to wrap events in act(), and every user interaction logs "not wrapped in act(...)" warnings.
        inline: ['@testing-library/dom', '@testing-library/react', '@testing-library/user-event'],
      },
    },
  },
});
