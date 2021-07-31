import { ProjectLink } from '../graphqlTypes.generated';

export type ProjectLinkDisplayProps = {
  link: Pick<ProjectLink, 'url' | 'icon' | 'title'>;
};

export function ProjectLinkDisplay({ link }: ProjectLinkDisplayProps): JSX.Element {
  return (
    <a href={link.url} target="_blank" rel="noreferrer noopener">
      {link.icon && (
        <>
          <i className={`fa fa-${link.icon}`} />{' '}
        </>
      )}
      {link.title}
    </a>
  );
}
