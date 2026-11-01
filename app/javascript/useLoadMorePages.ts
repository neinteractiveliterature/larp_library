import { useCallback, useState } from 'react';

/**
 * Infinite scrolling for a page whose loader serves a list a page at a time. The loader returns a page of items with the
 * list's `totalCount` and the `offset` the page starts at, and, given an `offset` in the URL's query string, the page from
 * there. Pages load the later pages through a fetcher of their own (so the loader's types stay concrete) and hand each one to
 * `addPage`; this keeps what's been scrolled in so far, in order, after the loader's own first page.
 *
 * Use it in a component that's remounted when the list changes (say, with a `key` made from the search), since the pages
 * it has collected belong to one list.
 */
export function useLoadMorePages<TItem>(firstItems: TItem[]) {
  const [laterPages, setLaterPages] = useState<Record<number, TItem[]>>({});

  const addPage = useCallback((offset: number, items: TItem[]) => {
    setLaterPages((pages) => ({ ...pages, [offset]: items }));
  }, []);

  const items = [
    ...firstItems,
    ...Object.entries(laterPages)
      .sort(([a], [b]) => Number(a) - Number(b))
      .flatMap(([, page]) => page),
  ];

  return { items, addPage };
}

/** Where the loader serves the page of the current list that starts at `offset` */
export function pageUrl(location: { pathname: string; search: string }, offset: number): string {
  const params = new URLSearchParams(location.search);
  params.set('offset', String(offset));
  return `${location.pathname}?${params.toString()}`;
}
