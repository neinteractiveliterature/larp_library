import { useCallback } from 'react';
import { useFetcher } from 'react-router';
import type { clientAction, ProjectContentActionBody } from './ProjectContentRoute';

/** A fetcher that submits changes to a project's files and links, to the action at `action` (see ProjectContentRoute) */
export function useProjectContentFetcher(action: string) {
  const fetcher = useFetcher<typeof clientAction>();
  const { submit } = fetcher;

  const submitBody = useCallback(
    (body: ProjectContentActionBody) => submit(body, { method: 'post', encType: 'application/json', action }),
    [submit, action],
  );

  return [fetcher, submitBody] as const;
}
