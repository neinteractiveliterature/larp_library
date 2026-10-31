/**
 * Factories for GraphQL result objects.  Apollo only hands a component the fields its query asked for, and logs
 * "Missing field" for any that are absent from the mock, so each factory fills in every field the app's queries and
 * fragments select.  Pass overrides for whatever the test cares about.
 */

let nextId = 1;
function uniqueId(): string {
  return String(nextId++);
}

export function resetFixtureIds() {
  nextId = 1;
}

export function buildTagCategory(overrides: Record<string, unknown> = {}) {
  const id = uniqueId();
  return {
    __typename: 'TagCategory' as const,
    id,
    name: `Category ${id}`,
    color: '#336699',
    textColor: '#ffffff',
    icon: 'bi-tag',
    ...overrides,
  };
}

export function buildTag(overrides: Record<string, unknown> = {}) {
  const id = uniqueId();
  return {
    __typename: 'Tag' as const,
    id,
    name: `tag-${id}`,
    tagCategory: buildTagCategory(),
    ...overrides,
  };
}

export function buildBrand(overrides: Record<string, unknown> = {}) {
  const id = uniqueId();
  return {
    __typename: 'Brand' as const,
    id,
    name: `Brand ${id}`,
    slug: `brand-${id}`,
    description: `Description of brand ${id}`,
    approved: true,
    currentUserCanEdit: false,
    currentUserCanCreateProjects: false,
    currentUserCanManageMemberships: false,
    ...overrides,
  };
}

export function buildLicense(overrides: Record<string, unknown> = {}) {
  const id = uniqueId();
  return {
    __typename: 'License' as const,
    id,
    name: `CC BY ${id}`,
    url: `https://example.com/licenses/${id}`,
    logoUrl: null,
    dedicationHtml: null,
    discouraged: false,
    discouragedReason: null,
    ...overrides,
  };
}

/** The fields selected by ProjectHeadersFragment (what list pages and ProjectCard show) */
export function buildProjectHeaders(overrides: Record<string, unknown> = {}) {
  const id = uniqueId();
  return {
    __typename: 'Project' as const,
    id,
    title: `Project ${id}`,
    authors: 'Pat Author',
    minPlayers: 6,
    maxPlayers: 12,
    minFacilitators: 1,
    maxFacilitators: 2,
    publicationYear: 2024,
    lengthQuantity: 3,
    lengthUnits: 'hours',
    brand: { __typename: 'Brand' as const, id: `brand-for-${id}`, name: `Brand for ${id}`, slug: `brand-for-${id}` },
    tags: [] as ReturnType<typeof buildTag>[],
    ...overrides,
  };
}

export function buildProjectFile(overrides: Record<string, unknown> = {}) {
  const id = uniqueId();
  return {
    __typename: 'ProjectFile' as const,
    id,
    url: `https://files.example.com/${id}.pdf`,
    filename: `file-${id}.pdf`,
    filesize: 2048,
    filetype: 'application/pdf',
    position: 1,
    ...overrides,
  };
}

export function buildProjectLink(overrides: Record<string, unknown> = {}) {
  const id = uniqueId();
  return {
    __typename: 'ProjectLink' as const,
    id,
    url: `https://example.com/links/${id}`,
    title: `Link ${id}`,
    icon: 'bi-link',
    position: 1,
    ...overrides,
  };
}

/** A relay-style connection, as returned by the paginated fields */
export function buildConnection<T extends { id: string }>(
  nodes: T[],
  { totalCount = nodes.length, endCursor = nodes.length > 0 ? `cursor-${nodes[nodes.length - 1].id}` : null } = {},
) {
  return {
    __typename: 'Connection' as const,
    pageInfo: { __typename: 'PageInfo' as const, endCursor },
    totalCount,
    edges: nodes.map((node) => ({ __typename: 'Edge' as const, node })),
  };
}
