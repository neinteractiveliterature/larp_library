import type {
  ProjectFileData,
  ProjectLinkData,
  ProjectPageData,
} from '../../app/javascript/server/lib/projects.server';

// Builders for the plain data the project pages' loaders return, with sensible defaults, so a test says only what matters to it.

let nextId = 1000;
const uniqueId = () => nextId++;

export function buildFile(overrides: Partial<ProjectFileData> = {}): ProjectFileData {
  const id = uniqueId();
  return {
    id,
    url: `https://files.example.com/${id}.pdf`,
    filename: `file-${id}.pdf`,
    filesize: 2048,
    filetype: 'application/pdf',
    position: 1,
    ...overrides,
  };
}

export function buildLink(overrides: Partial<ProjectLinkData> = {}): ProjectLinkData {
  const id = uniqueId();
  return {
    id,
    url: `https://example.com/links/${id}`,
    title: `Link ${id}`,
    icon: 'link',
    position: 1,
    ...overrides,
  };
}

/** A project as its page's loader returns it: a licensed project of the brand "Acme", which the viewer can do everything to */
export function buildProject(overrides: Partial<ProjectPageData['project']> = {}): ProjectPageData['project'] {
  return {
    id: 7,
    title: 'The Big Larp',
    authors: null,
    minPlayers: null,
    maxPlayers: null,
    minFacilitators: null,
    maxFacilitators: null,
    publicationYear: null,
    lengthQuantity: null,
    lengthUnits: null,
    brand: { id: 1, name: 'Acme', slug: 'acme' },
    tags: [],
    description: 'About the larp.',
    license: {
      id: 'cc40_by',
      name: 'CC BY',
      url: 'https://creativecommons.org/licenses/by/4.0/',
      logoUrl: null,
      dedicationHtml: null,
      discouraged: false,
      discouragedReason: null,
    },
    projectFiles: [],
    projectLinks: [],
    currentUserCanEdit: true,
    currentUserCanDelete: true,
    currentUserCanUploadFiles: true,
    currentUserCanDeleteFiles: true,
    ...overrides,
  };
}
