import { notEmpty } from '@neinteractiveliterature/litform';
import pickBy from 'lodash/pickBy';
import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import stringPresence from '../stringPresence';
import { decodeProjectSearchParams, encodeProjectSearchParams, type ProjectSearchParams } from './projectSearchParams';

function useSearchParams<T>(
  path: string,
  decodeParamsObject: (urlSearchParams: URLSearchParams) => T,
  encodeParamsObject: (paramsObject: T) => { [key: string]: string | null | undefined },
): readonly [T, (newParams: Partial<T>) => void] {
  const location = useLocation();
  const navigate = useNavigate();
  const urlSearchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const paramsObject = useMemo<T>(() => decodeParamsObject(urlSearchParams), [urlSearchParams, decodeParamsObject]);

  const setParamsObject = useCallback(
    (newParams: Partial<T>) => {
      const mergedParams = { ...paramsObject, ...newParams };
      const paramsForUrl = encodeParamsObject(mergedParams);
      const compactedParams = pickBy(paramsForUrl, (value): value is string => notEmpty(stringPresence(value)));
      const newUrlSearchParams = new URLSearchParams(compactedParams);
      if (newUrlSearchParams.toString() !== location.search.replace(/^\?/, '')) {
        navigate(`${path}?${newUrlSearchParams.toString()}`, { replace: true });
      }
    },
    [paramsObject, path, encodeParamsObject, navigate, location.search],
  );

  return [paramsObject, setParamsObject] as const;
}

export default function useProjectSearchParams(): readonly [
  ProjectSearchParams,
  (newParams: Partial<ProjectSearchParams>) => void,
] {
  return useSearchParams('/projects', decodeProjectSearchParams, encodeProjectSearchParams);
}
