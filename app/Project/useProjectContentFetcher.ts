import { useCallback } from 'react';
import { useFetcher } from 'react-router';
import type { action, ProjectContentActionBody } from '~/Project/ProjectContentRoute';

/** A fetcher that submits changes to a project's files and links, to the route at `actionPath` (see ProjectContentRoute) */
export function useProjectContentFetcher(actionPath: string) {
  const fetcher = useFetcher<typeof action>();
  const { submit } = fetcher;

  const submitBody = useCallback(
    (body: ProjectContentActionBody) =>
      submit(body, { method: 'post', encType: 'application/json', action: actionPath }),
    [submit, actionPath],
  );

  return [fetcher, submitBody] as const;
}
