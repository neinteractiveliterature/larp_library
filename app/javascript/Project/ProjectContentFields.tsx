import { Project } from '../graphqlTypes.generated';
import ProjectFile from './ProjectFile';
import { ProjectFileFieldsFragment, ProjectLinkFieldsFragment } from './queries.generated';
import S3Upload, { S3UploadProps } from './S3Upload';

export type ProjectContentFieldsProps = Omit<S3UploadProps, 'projectId'> & {
  project: Pick<Project, 'id' | 'currentUserCanUploadFiles' | 'currentUserCanDeleteFiles'> & {
    projectFiles: ProjectFileFieldsFragment[];
    projectLinks: ProjectLinkFieldsFragment[];
  };
};

export default function ProjectContentFields({
  project,
  ...s3UploadProps
}: ProjectContentFieldsProps): JSX.Element {
  return (
    <>
      <div className="alert alert-info">
        <div className="d-flex align-items-top">
          <div className="me-3">
            <i className="fa fa-info-circle fs-1" />
          </div>
          <div>
            <p>
              This is where you provide your content for people to download. This can be anything
              used for running your larp - text, music, videos, software, etc. You can either link
              to the content hosted elsewhere on the web, or upload files here and Larp Library will
              host them for you.
            </p>

            <p className="mb-0">
              Please note that if you upload files,{' '}
              <strong>
                you must choose{' '}
                <a href="/pages/licensing" target="_blank">
                  a Larp Library-approved license
                </a>{' '}
                for your larp.
              </strong>{' '}
              This isn’t required if you’re hosting the content elsewhere and linking to it from
              here.
            </p>
          </div>
        </div>
      </div>

      <div className="d-flex flex-wrap">
        <div className="card col-md-4 me-md-2 mb-2 mb-md-0">
          <div className="card-header">Files</div>
          <div className="card-body">
            <ul className="list-unstyled">
              {project.projectFiles.map((file) => (
                <ProjectFile file={file} project={project} key={file.id} />
              ))}
            </ul>

            {project.currentUserCanUploadFiles && <S3Upload project={project} {...s3UploadProps} />}
          </div>
        </div>

        <div className="card col-md-4 me-md-2 mb-2 mb-md-0">
          <div className="card-header">Links</div>
          <div className="card-body">
            <ul className="list-unstyled">
              {project.projectLinks.map((link) => (
                <a href={link.url} key={link.id}>
                  {link.title}
                </a>
              ))}
            </ul>

            <button type="button" className="btn btn-outline-success">
              Add link
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
