import { DeleteObjectCommand, HeadObjectCommand, NotFound, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomBytes } from 'node:crypto';
import { env } from '~/server/env';

/** How long a presigned upload URL stays valid, in seconds */
const UPLOAD_URL_LIFETIME = 15 * 60;

/** Where uploaded files go in the bucket */
export const UPLOAD_KEY_PREFIX = 'uploads/';

export type UploadTarget = {
  /** Where the browser PUTs the file's bytes */
  uploadUrl: string;
  /** Headers the PUT has to send, exactly as given, because they're part of what was signed */
  headers: Record<string, string>;
  /** The file's key in the bucket, which the browser hands back once the upload has finished */
  key: string;
};

/** What the app needs from file storage: signed upload URLs, checking an upload arrived, and deleting a file */
export type FileStorage = {
  createUploadTarget(file: { filename: string; contentType: string }): Promise<UploadTarget>;
  /** The size of the file at `key` in bytes, or null if there's nothing there */
  findFileSize(key: string): Promise<number | null>;
  deleteFile(key: string): Promise<void>;
  /** The address anyone can download the file at `key` from */
  publicUrl(key: string): string;
};

/** The name the file gets in the bucket: what the uploader called it, with anything awkward in a URL replaced */
export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^A-Za-z0-9.]/g, '_');
}

/**
 * A `Content-Disposition` header that makes browsers download the file under its real name. Header values can only hold
 * Latin-1, so the name is given twice: plain ASCII for old clients, and percent-encoded UTF-8 (RFC 5987) for the rest.
 */
export function contentDispositionFor(filename: string): string {
  const asciiFallback = filename.replace(/[^\x20-\x7e]/g, '_').replace(/["\\]/g, '_');
  return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodeURIComponent(filename).replace(/['()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)}`;
}

/**
 * The key a stored file path refers to. Older files were recorded with the bucket name in front (`/bucket/uploads/...`), and
 * paths may be percent-encoded.
 */
export function keyFromFilepath(filepath: string, bucket: string): string {
  return decodeURIComponent(filepath.replace(new RegExp(`^/${bucket}/`), ''));
}

export function createS3Storage({ bucket, client }: { bucket: string; client: S3Client }): FileStorage {
  const publicUrl = (key: string) => `https://${bucket}.s3.amazonaws.com/${key}`;

  return {
    publicUrl,

    async createUploadTarget({ filename, contentType }) {
      // The key is chosen here, not by the browser, so that it's always somewhere in uploads/ and never a file already there
      const key = `${UPLOAD_KEY_PREFIX}${Date.now()}-${randomBytes(8).toString('hex')}/${sanitizeFilename(filename)}`;
      const headers = {
        'Content-Type': contentType,
        'Content-Disposition': contentDispositionFor(filename),
      };

      const uploadUrl = await getSignedUrl(
        client,
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          // Uploaded files are public, as they always have been: anyone can download what a project offers
          ACL: 'public-read',
          ContentType: headers['Content-Type'],
          ContentDisposition: headers['Content-Disposition'],
          StorageClass: 'STANDARD',
        }),
        { expiresIn: UPLOAD_URL_LIFETIME, signableHeaders: new Set(['content-type', 'content-disposition']) },
      );
      return { uploadUrl, headers, key };
    },

    async findFileSize(key) {
      try {
        const { ContentLength } = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
        return ContentLength ?? 0;
      } catch (error) {
        if (error instanceof NotFound) {
          return null;
        }
        throw error;
      }
    },

    async deleteFile(key) {
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    },
  };
}

let storage: FileStorage | undefined;

/** The app's file storage: the bucket named by AWS_S3_BUCKET */
export const fileStorage: FileStorage = {
  createUploadTarget: (file) => getStorage().createUploadTarget(file),
  findFileSize: (key) => getStorage().findFileSize(key),
  deleteFile: (key) => getStorage().deleteFile(key),
  publicUrl: (key) => getStorage().publicUrl(key),
};

function getStorage(): FileStorage {
  if (!storage) {
    if (!env.AWS_S3_BUCKET) {
      throw new Error('AWS_S3_BUCKET must be set to use file storage');
    }
    storage = createS3Storage({ bucket: env.AWS_S3_BUCKET, client: new S3Client({ region: env.AWS_REGION }) });
  }
  return storage;
}

/** The bucket's name, for building the key of a file stored before keys and URLs were recorded separately */
export function bucketName(): string {
  if (!env.AWS_S3_BUCKET) {
    throw new Error('AWS_S3_BUCKET must be set to use file storage');
  }
  return env.AWS_S3_BUCKET;
}
