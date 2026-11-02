// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { parameterize } from '~/.server/lib/parameterize';

describe('parameterize', () => {
  // Every expected value here is what Rails' String#parameterize returned for the same name
  it.each([
    ['Team No Pants', 'team-no-pants'],
    ["Bob's Games", 'bob-s-games'],
    ['Café Intrigue', 'cafe-intrigue'],
    ['  Spaced   Out  ', 'spaced-out'],
    ['A & B Productions', 'a-b-productions'],
    ['Über Larp!', 'uber-larp'],
    ['Straße Games', 'strasse-games'],
    ['100% Fun', '100-fun'],
    ['---dashes---', 'dashes'],
    ['Ñandú Studios', 'nandu-studios'],
    ['日本のゲーム', ''],
    ['!!!', ''],
    ['Mixed_Case-Name', 'mixed_case-name'],
    ['Rock & Roll', 'rock-roll'],
    ['O.K. Corral', 'o-k-corral'],
  ])('turns %j into %j', (name, slug) => {
    expect(parameterize(name)).toEqual(slug);
  });
});
