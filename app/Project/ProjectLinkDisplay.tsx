import type { JSX } from 'react';
import type { ProjectLinkData } from '~/server/lib/projects.server';

export type ProjectLinkDisplayProps = {
  link: Pick<ProjectLinkData, 'url' | 'icon' | 'title'>;
};

export function ProjectLinkDisplay({ link }: ProjectLinkDisplayProps): JSX.Element {
  return (
    <a href={link.url} target="_blank" rel="noreferrer noopener">
      {link.icon && (
        <>
          <i className={`bi-${link.icon}`} />{' '}
        </>
      )}
      {link.title}
    </a>
  );
}
