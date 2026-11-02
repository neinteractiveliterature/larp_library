import type { JSX } from 'react';
import { BootstrapFormInput, FormGroupWithLabel, usePropertySetters } from '@neinteractiveliterature/litform';
import IconSelect from '../IconSelect';

export type ProjectLinkFormProjectLink = { title: string; url: string; icon?: string | null };

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
      <FormGroupWithLabel
        label="Icon"
        helpText={
          <>
            Use{' '}
            <a href="https://icons.getbootstrap.com/#icons" target="_blank" rel="noreferrer noopener">
              Bootstrap Icons icon names
            </a>
          </>
        }
      >
        {(id) => <IconSelect id={id} value={projectLink.icon ?? undefined} onChange={setIcon} />}
      </FormGroupWithLabel>
    </>
  );
}

export default ProjectLinkFormFields;
