import { useMemo } from 'react';
import type { FetcherWithComponents } from 'react-router';

type MovePayload = { id: string; destinationIndex: number };

function isMovePayload(json: unknown, intent: string): json is MovePayload {
  return (
    typeof json === 'object' &&
    json !== null &&
    'intent' in json &&
    json.intent === intent &&
    'id' in json &&
    typeof json.id === 'string' &&
    'destinationIndex' in json &&
    typeof json.destinationIndex === 'number'
  );
}

/**
 * The list as it will look once a move that's being saved has gone through, so dragging an item doesn't snap it back to
 * where it was while waiting for the server.  `fetcher` is the one that submits `{ intent, id, destinationIndex }`; once
 * it's idle again the page's reloaded data is the truth.
 */
export function useOptimisticMove<T extends { id: string }>(
  sortedItems: T[],
  fetcher: FetcherWithComponents<unknown>,
  intent: 'moveFile' | 'moveLink',
): T[] {
  const { state, json } = fetcher;

  return useMemo(() => {
    if (state === 'idle' || !isMovePayload(json, intent)) {
      return sortedItems;
    }

    const dragIndex = sortedItems.findIndex((item) => item.id === json.id);
    if (dragIndex < 0) {
      return sortedItems;
    }

    const moved = [...sortedItems];
    const [item] = moved.splice(dragIndex, 1);
    moved.splice(json.destinationIndex, 0, item);
    return moved;
  }, [sortedItems, state, json, intent]);
}
