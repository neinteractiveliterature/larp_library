import { formatPageTitle, pageTitle } from './pageTitle';
import { meta as larpsMeta } from './ProjectSearch/ProjectSearchPage';
import { meta as aboutMeta } from './StaticPages/AboutPage';

describe('formatPageTitle', () => {
  it('puts the page name before the site name', () => {
    expect(formatPageTitle('Larps')).toEqual('Larps | Larp Library');
  });

  it('falls back to the site name alone', () => {
    expect(formatPageTitle()).toEqual('Larp Library');
    expect(formatPageTitle(null)).toEqual('Larp Library');
    expect(formatPageTitle('')).toEqual('Larp Library');
  });
});

describe('pageTitle', () => {
  it('builds a route meta function', () => {
    expect(pageTitle('Tags')()).toEqual([{ title: 'Tags | Larp Library' }]);
  });

  it('is what the static pages export', () => {
    expect(larpsMeta()).toEqual([{ title: 'Larps | Larp Library' }]);
    expect(aboutMeta()).toEqual([{ title: 'About us | Larp Library' }]);
  });
});
