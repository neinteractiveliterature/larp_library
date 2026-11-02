import React, { useState, type JSX } from 'react';
import { LoadingIndicator } from '@neinteractiveliterature/litform';
import { useRevalidator } from 'react-router';
import { generateProjectUploadActionPath } from '~/URLGenerators';

export type S3UploadProps = { project: Parameters<typeof generateProjectUploadActionPath>[0] };

/** What came back from the server's upload route: JSON with either what was asked for or `errors` saying what's wrong */
async function postJson(path: string, body: unknown): Promise<Record<string, unknown>> {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const failure = await response.json().catch(() => ({}));
    const errors: unknown = failure.errors;
    throw new Error(Array.isArray(errors) ? errors.join('; ') : `The server refused the upload (${response.status})`);
  }
  return response.json();
}

type UploadTarget = { uploadUrl: string; headers: Record<string, string>; key: string };

function isUploadTarget(value: unknown): value is UploadTarget {
  return (
    typeof value === 'object' &&
    value != null &&
    'uploadUrl' in value &&
    typeof value.uploadUrl === 'string' &&
    'key' in value &&
    typeof value.key === 'string' &&
    'headers' in value &&
    typeof value.headers === 'object'
  );
}

/** Sends a file's bytes to storage with a PUT, reporting progress (which `fetch` can't do for an upload) */
function putFile(target: UploadTarget, file: File, onProgress: (percent: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('PUT', target.uploadUrl);
    for (const [name, value] of Object.entries(target.headers)) {
      request.setRequestHeader(name, value);
    }
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        resolve();
      } else {
        reject(new Error(`Storage refused the file (${request.status})`));
      }
    };
    request.onerror = () => reject(new Error('The upload failed. Check your connection and try again.'));
    request.send(file);
  });
}

function S3Upload({ project }: S3UploadProps): JSX.Element {
  const uploadPath = generateProjectUploadActionPath(project);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string>();
  const [progressPercent, setProgressPercent] = useState(0);
  const [error, setError] = useState<string>();
  const { revalidate } = useRevalidator();

  /** Uploads one file: ask where to send it, send it, and tell the server it's there */
  const uploadFile = async (file: File) => {
    setMessage(`Uploading ${file.name}...`);
    setProgressPercent(0);
    const filetype = file.type || null;

    const { upload } = await postJson(uploadPath, { intent: 'request', filename: file.name, filetype });
    if (!isUploadTarget(upload)) {
      throw new Error('The server did not say where to send the file');
    }
    await putFile(upload, file, setProgressPercent);
    await postJson(uploadPath, { intent: 'complete', key: upload.key, filename: file.name, filetype });

    // the file isn't a form submission (its bytes went straight to storage), so tell the page to reload its project to
    // show it
    await revalidate();
  };

  const uploadFiles = async (files: File[]) => {
    setUploading(true);
    setError(undefined);
    try {
      for (const file of files) {
        await uploadFile(file);
      }
      setMessage(undefined);
    } catch (uploadError) {
      console.error(uploadError);
      setError(uploadError instanceof Error ? uploadError.message : String(uploadError));
    } finally {
      setUploading(false);
    }
  };

  const fileChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length > 0) {
      void uploadFiles(files);
    }
  };

  return (
    <div className="card bg-light">
      <div className="card-body">
        <label className="form-label" htmlFor="file">
          Upload files
        </label>
        <input type="file" id="file" className="form-control" multiple onChange={fileChanged} disabled={uploading} />

        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
          {error && <div className="text-danger">{error}</div>}
          {message}
          {uploading && <LoadingIndicator size={9} />}
          {(uploading || error) && (
            <div className="progress">
              {' '}
              <div
                className={
                  error
                    ? 'progress-bar progress-bar-danger'
                    : 'progress-bar progress-bar-striped progress-bar-animated active'
                }
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                style={{ width: `${progressPercent}%` }}
              >
                <span className="sr-only">{progressPercent}% Complete</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default S3Upload;
