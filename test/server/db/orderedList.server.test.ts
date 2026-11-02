// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { moveItem } from '~/.server/db/orderedList.server';

describe('moveItem', () => {
  const abcde = ['a', 'b', 'c', 'd', 'e'];

  it.each([
    [0, 2, ['b', 'c', 'a', 'd', 'e']],
    [3, 0, ['d', 'a', 'b', 'c', 'e']],
    [1, 1, abcde],
    [0, 4, ['b', 'c', 'd', 'e', 'a']],
    [4, 0, ['e', 'a', 'b', 'c', 'd']],
  ])('moving index %i to index %i', (from, to, expected) => {
    expect(moveItem(abcde, from, to)).toEqual(expected);
  });

  it('puts an item at the end of the list when the destination is past it, or at the start when it is before it', () => {
    expect(moveItem(abcde, 0, 99)).toEqual(['b', 'c', 'd', 'e', 'a']);
    expect(moveItem(abcde, 4, -3)).toEqual(['e', 'a', 'b', 'c', 'd']);
  });

  it('does not change the list it was given', () => {
    moveItem(abcde, 0, 3);
    expect(abcde).toEqual(['a', 'b', 'c', 'd', 'e']);
  });
});
