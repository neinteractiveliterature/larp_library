import stringPresence from '~/lib/stringPresence';

// The project search lives in the URL, so the page and its loader (on the server) both read it from there. (Browser-safe:
// nothing here imports server code.)

export type ProjectSearchParams = {
  /** Words to look for in titles, descriptions and authors; any one of them matching is enough */
  queryString?: string;
  /** The exact name of a tag the project must have */
  tag?: string;
  title?: string;
  authors?: string;
  /** Projects that can take at least this many players, i.e. whose maximum is at least this */
  playerCountUpperBound?: number | null;
  /** Projects that can be run with this few players, i.e. whose minimum is at most this */
  playerCountLowerBound?: number | null;
  facilitatorCountUpperBound?: number | null;
  facilitatorCountLowerBound?: number | null;
};

function parseInteger(value: string | null): number | undefined {
  if (value == null || !/^\s*-?\d+\s*$/.test(value)) {
    return undefined;
  }
  return parseInt(value, 10);
}

export function decodeProjectSearchParams(urlSearchParams: URLSearchParams): ProjectSearchParams {
  return {
    queryString: stringPresence(urlSearchParams.get('q')),
    tag: stringPresence(urlSearchParams.get('tag')),
    title: stringPresence(urlSearchParams.get('title')),
    authors: stringPresence(urlSearchParams.get('authors')),
    playerCountLowerBound: parseInteger(urlSearchParams.get('player_count_lower')),
    playerCountUpperBound: parseInteger(urlSearchParams.get('player_count_upper')),
    facilitatorCountLowerBound: parseInteger(urlSearchParams.get('facilitator_count_lower')),
    facilitatorCountUpperBound: parseInteger(urlSearchParams.get('facilitator_count_upper')),
  };
}

export function encodeProjectSearchParams(params: ProjectSearchParams) {
  return {
    q: params.queryString,
    tag: params.tag,
    title: params.title,
    authors: params.authors,
    player_count_lower: params.playerCountLowerBound?.toString(),
    player_count_upper: params.playerCountUpperBound?.toString(),
    facilitator_count_lower: params.facilitatorCountLowerBound?.toString(),
    facilitator_count_upper: params.facilitatorCountUpperBound?.toString(),
  };
}
