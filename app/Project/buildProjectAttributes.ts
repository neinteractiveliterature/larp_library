import type { ProjectFormProps } from './ProjectFormFields';

/** What the project form sends to the server (JSON, so anything blank is null rather than missing) */
export function buildProjectAttributes(project: ProjectFormProps['project']) {
  return {
    authors: project.authors ?? null,
    description: project.description ?? null,
    lengthQuantity: project.lengthQuantity ?? null,
    lengthUnits: project.lengthUnits ?? null,
    licenseId: project.license?.id ?? null,
    maxPlayers: project.maxPlayers ?? null,
    minPlayers: project.minPlayers ?? null,
    maxFacilitators: project.maxFacilitators ?? null,
    minFacilitators: project.minFacilitators ?? null,
    publicationYear: project.publicationYear ?? null,
    tagNames: project.tags.map((tag) => tag.name),
    title: project.title ?? null,
  };
}
