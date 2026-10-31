import '@testing-library/jest-dom/vitest';
import { configure } from '@testing-library/react';
import { afterEach, beforeEach, MockInstance, vi } from 'vitest';

// The default (1s) is tight for tests that wait on debounced inputs when CI runners are slow.  A passing test never
// waits this long; it only matters for tests that are about to fail.
configure({ asyncUtilTimeout: 4000 });

// Fail any test that makes React log "not wrapped in act(...)".  Those warnings mean a state update landed outside
// the test's control, so the test can be asserting on (or finishing before) an intermediate state -- and a suite that
// logs hundreds of them trains everyone to ignore the ones that matter.  Usually the fix is to `await` the interaction
// (userEvent) or the content you're waiting on (findBy*, waitFor).
let consoleError: MockInstance<typeof console.error>;
let actWarnings: string[] = [];

beforeEach(() => {
  actWarnings = [];
  const originalConsoleError = console.error;
  consoleError = vi.spyOn(console, 'error').mockImplementation((...args: Parameters<typeof console.error>) => {
    const message = args.map(String).join(' ');
    if (message.includes('not wrapped in act')) {
      actWarnings.push(message.split('\n')[0]);
    }
    originalConsoleError(...args);
  });
});

afterEach(() => {
  consoleError.mockRestore();
  if (actWarnings.length > 0) {
    throw new Error(
      `React logged ${actWarnings.length} "not wrapped in act(...)" warning(s) during this test, e.g. "${actWarnings[0]}". ` +
        'Await the interaction or the content being waited on.',
    );
  }
});

// jsdom does no layout, and CodeMirror (used by the markdown editor) measures text ranges
if (typeof Range !== 'undefined') {
  Range.prototype.getClientRects ??= () =>
    Object.assign<DOMRect[], { item: () => DOMRect | null }>([], { item: () => null });
  Range.prototype.getBoundingClientRect ??= () => new DOMRect();
}
