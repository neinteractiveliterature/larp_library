import { describe, expect, it } from 'vitest';
import { findLicense, LICENSES } from './licenses';

describe('LICENSES', () => {
  it('has a unique id for every license', () => {
    expect(new Set(LICENSES.map((license) => license.id)).size).toEqual(LICENSES.length);
  });

  it('only gives a reason for licenses that are discouraged', () => {
    for (const license of LICENSES) {
      expect(license.discouragedReason !== null).toEqual(license.discouraged);
    }
  });
});

describe('findLicense', () => {
  it('finds a license by id', () => {
    expect(findLicense('cc40_by_sa')?.name).toEqual('Creative Commons Attribution-ShareAlike 4.0 International');
  });

  it.each([null, undefined, '', 'no_such_license'])('returns null for %j', (id) => {
    expect(findLicense(id)).toBeNull();
  });
});
