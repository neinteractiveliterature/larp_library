import { screen, within } from '@testing-library/react';

import * as HomePage from './HomePage';
import { HomePageQueryDocument } from './queries.generated';
import { buildConnection, buildProjectHeaders, buildTag, buildTagCategory } from '../../../test/javascript/fixtures';
import { renderRouteModule } from '../../../test/javascript/testUtils';

describe('HomePage', () => {
  it('shows the featured larps and tags grouped by category', async () => {
    const element = buildTagCategory({ id: 'cat-element', name: 'Element' });
    const genre = buildTagCategory({ id: 'cat-genre', name: 'Genre' });
    const featuredTag = buildTag({ id: 't1', name: 'horde', tagCategory: element });
    const comedy = buildTag({ id: 't2', name: 'comedy', tagCategory: genre });
    const misc = buildTag({ id: 't3', name: 'uncategorized-tag', tagCategory: null });

    renderRouteModule(HomePage, {
      mocks: [
        {
          request: { query: HomePageQueryDocument },
          result: {
            data: {
              projectPromotions: [
                {
                  __typename: 'ProjectPromotion',
                  id: 'promo-1',
                  project: buildProjectHeaders({ id: 'p1', title: 'An Unconventional Odyssey', tags: [featuredTag] }),
                },
              ],
              tags: buildConnection([
                { ...featuredTag, projects: { __typename: 'Connection', totalCount: 1 } },
                { ...comedy, projects: { __typename: 'Connection', totalCount: 4 } },
                { ...misc, projects: { __typename: 'Connection', totalCount: 2 } },
              ]),
              tagCategories: buildConnection([
                { ...genre, tags: [comedy] },
                { ...element, tags: [featuredTag] },
              ]),
            },
          },
        },
      ],
    });

    expect(await screen.findByRole('heading', { name: 'Welcome to Larp Library' })).toBeInTheDocument();
    expect(screen.getByText('An Unconventional Odyssey')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Browse all larps' })).toHaveAttribute('href', '/projects');

    // categories are listed alphabetically, and the counts pluralize
    const headings = screen.getAllByRole('heading', { level: 4 }).map((heading) => heading.textContent);
    expect(headings.indexOf('Element')).toBeLessThan(headings.indexOf('Genre'));
    const horde = screen.getAllByText('horde').find((el) => el.closest('li.mb-1'))!;
    expect(within(horde.closest('li')!).getByText('(1 project)')).toBeInTheDocument();
    const comedyItem = screen.getByText('comedy').closest('li')!;
    expect(within(comedyItem).getByText('(4 projects)')).toBeInTheDocument();

    // tags without a category fall into Miscellaneous
    expect(screen.getByRole('heading', { name: 'Miscellaneous' })).toBeInTheDocument();
    expect(screen.getByText('uncategorized-tag')).toBeInTheDocument();
  });
});
