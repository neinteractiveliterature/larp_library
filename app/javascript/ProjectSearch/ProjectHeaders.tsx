import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import { ReactNode, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Brand, Project } from '../graphqlTypes.generated';
import { TagFragment } from '../Tags/queries.generated';
import Tag from '../Tags/Tag';
import { generateBrandPath, generateProjectPath } from '../URLGenerators';

export type ProjectHeadersProps = {
  project: Pick<
    Project,
    | 'id'
    | 'title'
    | 'publicationYear'
    | 'authors'
    | 'minPlayers'
    | 'maxPlayers'
    | 'minFacilitators'
    | 'maxFacilitators'
    | 'lengthQuantity'
    | 'lengthUnits'
  > & {
    brand: Pick<Brand, 'slug' | 'name'>;
    tags: TagFragment[];
  };
  renderTitle?: (content: ReactNode) => ReactNode;
  metadataClassName?: string;
  hideAuthors?: boolean;
  hideBrandAndYear?: boolean;
};

function ProjectHeaders({
  project,
  renderTitle: providedRenderTitle,
  metadataClassName,
  hideAuthors,
  hideBrandAndYear,
}: ProjectHeadersProps): JSX.Element {
  const renderTitle =
    providedRenderTitle ?? ((title: ReactNode) => <h2 className="m-0">{title}</h2>);
  const sortedTags = useMemo(
    () => sortBy(project.tags, (tag) => tag.name.toLowerCase()),
    [project.tags],
  );

  return (
    <>
      {renderTitle(
        <>
          <Link to={generateProjectPath(project)} className="link-unstyled">
            {project.title}
          </Link>
          {!hideBrandAndYear && (project.brand.name != null || project.publicationYear != null) && (
            <small>
              {' '}
              (
              {project.brand.name && (
                <Link to={generateBrandPath(project.brand)} className="link-unstyled">
                  {project.brand.name}
                </Link>
              )}
              {project.brand.name && project.publicationYear && ', '}
              {project.publicationYear})
            </small>
          )}
        </>,
      )}
      <ul className={`list-unstyled m-0 ${metadataClassName}`}>
        {project.authors && !hideAuthors && (
          <li>
            <em>By {project.authors}</em>
          </li>
        )}
        {(project.minPlayers ||
          project.maxPlayers ||
          (project.lengthQuantity && project.lengthUnits)) && (
          <li>
            <ul className="list-inline">
              {(project.minPlayers != null || project.maxPlayers != null) && (
                <li className="list-inline-item">
                  <i className="fa fa-users"></i>{' '}
                  {uniq([project.minPlayers, project.maxPlayers])
                    .filter((count) => count != null)
                    .join(' - ')}{' '}
                  {(project.maxPlayers ?? project.minPlayers) == 1 ? 'player' : 'players'}
                </li>
              )}
              {(project.minFacilitators != null || project.maxFacilitators != null) && (
                <li className="list-inline-item">
                  <i className="fa fa-gavel"></i>{' '}
                  {uniq([project.minFacilitators, project.maxFacilitators])
                    .filter((count) => count != null)
                    .join(' - ')}{' '}
                  {(project.maxFacilitators ?? project.minFacilitators) == 1
                    ? 'facilitator/GM'
                    : 'facilitators/GMs'}
                </li>
              )}
              {project.lengthQuantity && project.lengthUnits && (
                <li className="list-inline-item">
                  <i className="fa fa-clock-o"></i> {project.lengthQuantity}{' '}
                  {project.lengthQuantity === 1
                    ? project.lengthUnits.replace(/s$/, '')
                    : project.lengthUnits}
                </li>
              )}
            </ul>
          </li>
        )}
        {project.tags.length > 0 && (
          <li>
            <ul className="list-inline">
              {sortedTags.map((tag) => (
                <li className="list-inline-item" key={tag.id}>
                  <Tag tag={tag} linkTo={`/projects?tag=${encodeURIComponent(tag.name)}`} />
                </li>
              ))}
            </ul>
          </li>
        )}
      </ul>
    </>
  );
}

export default ProjectHeaders;
