import EditProjectLinksCard from './EditProjectLinksCard';
import EditProjectFilesCard from './EditProjectFilesCard';
import { ProjectFieldsFragment } from './queries.generated';
import { S3UploadProps } from './S3Upload';

export type ProjectContentFieldsProps = Omit<S3UploadProps, 'projectId'> & {
  project: ProjectFieldsFragment;
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
            <i className="bi-info-circle-fill fs-1" />
          </div>
          <div>
            <p>
              This is where you provide your content for people to download. This can be anything
              used for running your larp - text, music, videos, software, etc. You can either link
              to the content hosted elsewhere on the web, or upload files here and Larp Library will
              host them for you.
            </p>

            <p className="mb-0">
              Please note that if you want to upload files,{' '}
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
        <EditProjectFilesCard project={project} {...s3UploadProps} />
        <EditProjectLinksCard project={project} />
      </div>
    </>
  );
}
