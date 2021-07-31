import { BootstrapFormInput, usePropertySetters } from '@neinteractiveliterature/litform';
import { ProjectLink } from '../graphqlTypes.generated';

export type ProjectLinkFormProjectLink = Pick<ProjectLink, 'title' | 'url' | 'icon'>;

export type ProjectLinkFormProps = {
  projectLink: ProjectLinkFormProjectLink;
  onChange: React.Dispatch<React.SetStateAction<ProjectLinkFormProjectLink>>;
};

function ProjectLinkFormFields({ projectLink, onChange }: ProjectLinkFormProps): JSX.Element {
  const [setTitle, setUrl, setIcon] = usePropertySetters(onChange, 'title', 'url', 'icon');

  return (
    <>
      <BootstrapFormInput label="Title" value={projectLink.title} onTextChange={setTitle} />
      <BootstrapFormInput label="URL" value={projectLink.url} onTextChange={setUrl} />
      <BootstrapFormInput
        label={
          <>
            Icon <i className={`fa fa-${projectLink.icon}`} />
          </>
        }
        helpText={
          <>
            Use{' '}
            <a href="https://fontawesome.com/v4.7/icons/" target="_blank" rel="noreferrer noopener">
              Font Awesome 4 icon names
            </a>
          </>
        }
        value={projectLink.icon ?? ''}
        onTextChange={setIcon}
      />
    </>
  );
}

export default ProjectLinkFormFields;
