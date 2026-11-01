// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { safeReturnTo } from './safeReturnTo';

describe('safeReturnTo', () => {
  it.each(['/', '/brands', '/brands/cool-games/projects/3?tab=content', '/projects#top'])(
    'allows the path %s',
    (path) => {
      expect(safeReturnTo(path)).toBe(path);
    },
  );

  it.each([
    null,
    undefined,
    '',
    'brands',
    'https://evil.example.com/',
    '//evil.example.com/',
    '/\\evil.example.com/',
    '/\t/evil.example.com/',
    '/\n/evil.example.com/',
    'javascript:alert(1)',
  ])('falls back to the home page for %j', (value) => {
    expect(safeReturnTo(value)).toBe('/');
  });
});
