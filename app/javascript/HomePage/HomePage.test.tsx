import { screen, within } from '@testing-library/react';

import HomePage from './HomePage';
import type { HomePageData } from '../server/lib/homePage.server';
import { renderRouteModule } from '../../../test/javascript/testUtils';

const element = { id: 1, name: 'Element', color: '#3366cc', textColor: '#ffffff', icon: 'fire' };
const genre = { id: 2, name: 'Genre', color: '#777777', textColor: '#ffffff', icon: 'tag' };

const data: HomePageData = {
  promotedProjects: [
    {
      id: 1,
      title: 'An Unconventional Odyssey',
      authors: 'Pat Smith',
      minPlayers: 4,
      maxPlayers: 8,
      minFacilitators: null,
      maxFacilitators: null,
      publicationYear: 2024,
      lengthQuantity: null,
      lengthUnits: null,
      brand: { id: 1, name: 'Cool Games', slug: 'cool-games' },
      tags: [{ id: 1, name: 'horde', tagCategory: element }],
    },
  ],
  tagGroups: [
    { category: element, tags: [{ id: 1, name: 'horde', tagCategory: element, projectCount: 1 }] },
    { category: genre, tags: [{ id: 2, name: 'comedy', tagCategory: genre, projectCount: 4 }] },
    { category: null, tags: [{ id: 3, name: 'uncategorized-tag', tagCategory: null, projectCount: 2 }] },
  ],
};

describe('HomePage', () => {
  it('shows the featured larps and tags grouped by category', async () => {
    renderRouteModule({ default: HomePage, loader: () => data });

    expect(await screen.findByRole('heading', { name: 'Welcome to Larp Library' })).toBeInTheDocument();
    const featured = screen.getByRole('link', { name: 'An Unconventional Odyssey' });
    expect(featured).toHaveAttribute('href', '/brands/cool-games/projects/1-an-unconventional-odyssey');
    expect(screen.getByRole('link', { name: 'Browse all larps' })).toHaveAttribute('href', '/projects');

    // the groups come in the order the loader gave them, and the counts pluralize
    const headings = screen.getAllByRole('heading', { level: 4 }).map((heading) => heading.textContent);
    expect(headings.filter((heading) => ['Element', 'Genre', 'Miscellaneous'].includes(heading ?? ''))).toEqual([
      'Element',
      'Genre',
      'Miscellaneous',
    ]);
    const hordeItem = screen
      .getAllByText('horde')
      .find((el) => el.closest('li.mb-1'))!
      .closest('li')!;
    expect(within(hordeItem).getByText('(1 project)')).toBeInTheDocument();
    expect(within(screen.getByText('comedy').closest('li')!).getByText('(4 projects)')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'comedy' })).toHaveAttribute('href', '/projects?tag=comedy');

    // tags without a category fall into Miscellaneous
    expect(screen.getByText('uncategorized-tag')).toBeInTheDocument();
  });

  it('omits the Miscellaneous group when every tag has a category', async () => {
    renderRouteModule({
      default: HomePage,
      loader: () => ({ ...data, tagGroups: data.tagGroups.filter((group) => group.category) }),
    });

    expect(await screen.findByRole('heading', { name: 'Element' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Miscellaneous' })).not.toBeInTheDocument();
  });
});
