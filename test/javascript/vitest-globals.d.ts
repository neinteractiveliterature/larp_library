// Makes describe/it/expect/etc. (enabled via `globals: true` in vitest.config.mts) and the jest-dom matchers known to
// TypeScript.  tsconfig.json sets typeRoots, so a `types` entry can't be used for this.
import 'vitest/globals';
import '@testing-library/jest-dom/vitest';
