import { ProjectPageQueryData } from './queries.generated';

function getIconForMimeType(mimeType: string | null | undefined): string {
  if (mimeType == null) {
    return 'fa-file-o';
  }

  if (mimeType.startsWith('image/')) {
    return 'fa-file-image-o';
  }

  if (mimeType.startsWith('text/')) {
    return 'fa-file-text-o';
  }

  if (mimeType === 'application/pdf') {
    return 'fa-file-pdf-o';
  }

  if (mimeType === 'application/zip' || mimeType === 'application/gzip') {
    return 'fa-file-zip-o';
  }

  return 'fa-file-o';
}

// from https://gist.github.com/233053/f401f59c344ab2d42a341513c6caaa2bb3b2da2d
function numberToHumanSize(size: number) {
  if (size < 1024) {
    return size + ' bytes';
  } else if (size < 1024.0 * 1024.0) {
    return (size / 1024.0).toFixed(2) + ' KiB';
  } else if (size < 1024.0 * 1024.0 * 1024.0) {
    return (size / 1024.0 / 1024.0).toFixed(2) + ' MiB';
  } else {
    return (size / 1024.0 / 1024.0 / 1024.0).toFixed(2) + ' GiB';
  }
}

export type ProjectFileDisplayProps = {
  file: ProjectPageQueryData['project']['projectFiles'][number];
};

export default function ProjectFileDisplay({ file }: ProjectFileDisplayProps): JSX.Element {
  return (
    <div className="flex-grow-1">
      <a href={file.url}>
        <i className={`fa ${getIconForMimeType(file.filetype)}`} /> {file.filename}
      </a>{' '}
      <small>{numberToHumanSize(file.filesize)}</small>
    </div>
  );
}
