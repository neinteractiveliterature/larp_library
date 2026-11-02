import { screen } from '@testing-library/react';

import TagListPage from '~/Tags/TagListPage';
import TagCategoryListPage from '~/TagCategories/TagCategoryListPage';
import { renderRouteModule, withRouteErrorDisplay } from '../testUtils';

const genre = { id: 4, name: 'Genre', color: '#112233', textColor: '#ffffff', icon: 'film' };

describe('TagListPage', () => {
  it('links each tag to its edit page, and offers to create a new one', async () => {
    renderRouteModule({
      default: TagListPage,
      loader: () => ({ tags: [{ id: 77, name: 'horde', tagCategory: null }] }),
    });

    expect(await screen.findByRole('link', { name: 'horde' })).toHaveAttribute('href', '/tags/77/edit');
    expect(screen.getAllByRole('link', { name: 'New tag' })).toHaveLength(2);
  });

  it('lists every tag it is given', async () => {
    renderRouteModule({
      default: TagListPage,
      loader: () => ({
        tags: [
          { id: 1, name: 'comedy', tagCategory: genre },
          { id: 2, name: 'drama', tagCategory: genre },
          { id: 3, name: 'horde', tagCategory: null },
        ],
      }),
    });

    expect(await screen.findByRole('link', { name: 'comedy' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'drama' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'horde' })).toBeInTheDocument();
  });

  it('shows the error instead of the page if the tags fail to load', async () => {
    renderRouteModule(
      withRouteErrorDisplay({
        default: TagListPage,
        loader: () => {
          throw new Error('boom');
        },
      }),
    );

    expect(await screen.findByText(/boom/)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Tags' })).not.toBeInTheDocument();
  });
});

describe('TagCategoryListPage', () => {
  it('links each category to its edit page', async () => {
    renderRouteModule({ default: TagCategoryListPage, loader: () => ({ tagCategories: [genre] }) });

    expect(await screen.findByRole('link', { name: 'Genre' })).toHaveAttribute('href', '/tag_categories/4/edit');
    expect(screen.getAllByRole('link', { name: 'New tag category' })).toHaveLength(2);
  });
});
