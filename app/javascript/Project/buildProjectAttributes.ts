import { ProjectAttributes } from '../graphqlTypes.generated';
import { ProjectFormProps } from './ProjectFormFields';

export function buildProjectAttributes(project: ProjectFormProps['project']): ProjectAttributes {
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
