import { ProjectAttributes } from '../graphqlTypes.generated';
import { ProjectFieldsFragment } from './queries.generated';

export function buildProjectAttributes(project: ProjectFieldsFragment): ProjectAttributes {
  return {
    authors: project.authors,
    description: project.description,
    lengthQuantity: project.lengthQuantity,
    lengthUnits: project.lengthUnits,
    licenseId: project.license?.id,
    maxPlayers: project.maxPlayers,
    minPlayers: project.minPlayers,
    publicationYear: project.publicationYear,
    tagNames: project.tags.map((tag) => tag.name),
    title: project.title,
  };
}
