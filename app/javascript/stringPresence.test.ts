import stringPresence from './stringPresence';

describe('stringPresence', () => {
  it.each([
    [null, undefined],
    [undefined, undefined],
    ['', undefined],
    ['   ', undefined],
    ['\t\n', undefined],
    ['wolf', 'wolf'],
    ['  padded  ', '  padded  '],
  ])('turns %j into %j', (input, expected) => {
    expect(stringPresence(input)).toEqual(expected);
  });
});
