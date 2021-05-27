import {
  BootstrapFormInput,
  usePropertySetters,
  parseIntOrNull,
  FormGroupWithLabel,
  BootstrapFormSelect,
} from '@neinteractiveliterature/litform';
import React from 'react';
import { License, Project } from '../graphqlTypes.generated';
import MarkdownEditor from '../MarkdownEditor';
import { TagFragment } from '../Tags/queries.generated';
import TagSelector from '../Tags/TagSelector';

type ProjectFormProject = Pick<
  Project,
  | 'title'
  | 'authors'
  | 'publicationYear'
  | 'description'
  | 'minPlayers'
  | 'maxPlayers'
  | 'lengthQuantity'
  | 'lengthUnits'
> & {
  tags: TagFragment[];
  license?: Pick<License, 'id' | 'name' | 'discouraged' | 'discouragedReason'> | null;
};

export type ProjectFormProps = {
  project: ProjectFormProject;
  onChange: React.Dispatch<React.SetStateAction<ProjectFormProject>>;
  licenseOptions: NonNullable<ProjectFormProject['license']>[];
};

export default function ProjectFormFields({
  project,
  onChange,
  licenseOptions,
}: ProjectFormProps): JSX.Element {
  const [
    setTitle,
    setAuthors,
    setPublicationYear,
    setDescription,
    setMinPlayers,
    setMaxPlayers,
    setLengthQuantity,
    setLengthUnits,
    setLicense,
    setTags,
  ] = usePropertySetters(
    onChange,
    'title',
    'authors',
    'publicationYear',
    'description',
    'minPlayers',
    'maxPlayers',
    'lengthQuantity',
    'lengthUnits',
    'license',
    'tags',
  );

  return (
    <>
      <BootstrapFormInput label="Title" value={project.title ?? ''} onTextChange={setTitle} />
      <BootstrapFormInput label="Authors" value={project.authors ?? ''} onTextChange={setAuthors} />
      <BootstrapFormInput
        label="Publication year"
        value={project.publicationYear ?? ''}
        onTextChange={(text) => setPublicationYear(parseIntOrNull(text))}
      />
      <FormGroupWithLabel label="Tags">
        {(id) => <TagSelector value={project.tags} onChange={setTags} id={id} />}
      </FormGroupWithLabel>
      <FormGroupWithLabel
        label={
          <>
            Description <small>(Markdown allowed)</small>
          </>
        }
      >
        {() => <MarkdownEditor value={project.description ?? ''} onChange={setDescription} />}
      </FormGroupWithLabel>
      <div className="row">
        <div className="col-sm-6 col-md-4 col-lg-3">
          <BootstrapFormInput
            type="number"
            label="Minimum player count"
            value={project.minPlayers ?? ''}
            onTextChange={(text) => setMinPlayers(parseIntOrNull(text))}
          />
        </div>
        <div className="col-sm-6 col-md-4 col-lg-3">
          <BootstrapFormInput
            type="number"
            label="Maximum player count"
            value={project.maxPlayers ?? ''}
            onTextChange={(text) => setMaxPlayers(parseIntOrNull(text))}
          />
        </div>
        <div className="col-md-4 col-lg-6"></div>
      </div>
      <div className="row">
        <div className="col-xs-6 col-md-4 col-lg-3">
          <BootstrapFormInput
            type="number"
            label="Game length"
            value={project.lengthQuantity ?? ''}
            onTextChange={(text) => setLengthQuantity(parseIntOrNull(text))}
          />
        </div>
        <div className="col-xs-6 col-md-4 col-lg-3">
          <BootstrapFormSelect
            label="Length units"
            value={project.lengthUnits ?? 'hours'}
            onValueChange={setLengthUnits}
          >
            <option value="minutes">minute(s)</option>
            <option value="hours">hour(s)</option>
            <option value="days">day(s)</option>
          </BootstrapFormSelect>
        </div>
        <div className="col-md-4 col-lg-6"></div>
      </div>
      <BootstrapFormSelect
        label="License"
        value={project.license?.id}
        onValueChange={(licenseId) =>
          setLicense(licenseOptions.find((license) => license.id === licenseId))
        }
      >
        {licenseOptions.map((license) => (
          <option key={license.id} value={license.id}>
            {license.name}
            {license.discouraged && ` (${license.discouragedReason})`}
          </option>
        ))}
      </BootstrapFormSelect>
    </>
  );
}
