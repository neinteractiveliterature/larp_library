import { notEmpty, parseIntOrNull } from '@neinteractiveliterature/litform';
import pickBy from 'lodash/pickBy';
import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import stringPresence from '../stringPresence';
import { ProjectSearchQueryVariables } from './queries.generated';

type ProjectSearchParams = Omit<ProjectSearchQueryVariables, 'after'>;

function useSearchParams<T>(
  path: string,
  decodeParamsObject: (urlSearchParams: URLSearchParams) => T,
  encodeParamsObject: (paramsObject: T) => { [key: string]: string | null | undefined },
): readonly [T, (newParams: Partial<T>) => void] {
  const location = useLocation();
  const navigate = useNavigate();
  const urlSearchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const paramsObject = useMemo<T>(
    () => decodeParamsObject(urlSearchParams),
    [urlSearchParams, decodeParamsObject],
  );

  const setParamsObject = useCallback(
    (newParams: Partial<T>) => {
      const mergedParams = { ...paramsObject, ...newParams };
      const paramsForUrl = encodeParamsObject(mergedParams);
      const compactedParams = pickBy(paramsForUrl, (value): value is string =>
        notEmpty(stringPresence(value)),
      );
      const newUrlSearchParams = new URLSearchParams(compactedParams);
      if (newUrlSearchParams.toString() !== location.search.replace(/^\?/, '')) {
        navigate(`${path}?${newUrlSearchParams.toString()}`, { replace: true });
      }
    },
    [paramsObject, path, encodeParamsObject, navigate, location.search],
  );

  return [paramsObject, setParamsObject] as const;
}

function decodeProjectSearchParams(urlSearchParams: URLSearchParams): ProjectSearchParams {
  return {
    queryString: stringPresence(urlSearchParams.get('q')),
    tag: stringPresence(urlSearchParams.get('tag')),
    title: stringPresence(urlSearchParams.get('title')),
    authors: stringPresence(urlSearchParams.get('authors')),
    playerCountLowerBound:
      parseIntOrNull(urlSearchParams.get('player_count_lower') ?? '') ?? undefined,
    playerCountUpperBound:
      parseIntOrNull(urlSearchParams.get('player_count_upper') ?? '') ?? undefined,
  };
}

function encodeProjectSearchParams(params: ProjectSearchParams) {
  return {
    q: params.queryString,
    tag: params.tag,
    title: params.title,
    authors: params.authors,
    player_count_lower: params.playerCountLowerBound?.toString(),
    player_count_upper: params.playerCountUpperBound?.toString(),
  };
}

export default function useProjectSearchParams(): readonly [
  ProjectSearchParams,
  (newParams: Partial<ProjectSearchParams>) => void,
] {
  return useSearchParams('/projects', decodeProjectSearchParams, encodeProjectSearchParams);
}
