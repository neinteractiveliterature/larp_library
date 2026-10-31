import { generateBrandPath, generateProjectPath } from './URLGenerators';

describe('URLGenerators', () => {
  it('generates a brand path from the slug', () => {
    expect(generateBrandPath({ slug: 'team-no-pants' })).toEqual('/brands/team-no-pants');
  });

  it('generates a project path from the id and a slugified title', () => {
    expect(generateProjectPath({ id: '12', title: 'The Trial of the Big Bad Wolf!', brand: { slug: 'b' } })).toEqual(
      '/brands/b/projects/12-the-trial-of-the-big-bad-wolf',
    );
  });
});
