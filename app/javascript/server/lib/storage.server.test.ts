// @vitest-environment node
import { S3Client } from '@aws-sdk/client-s3';
import { describe, expect, it } from 'vitest';
import {
  contentDispositionFor,
  createS3Storage,
  keyFromFilepath,
  sanitizeFilename,
  UPLOAD_KEY_PREFIX,
} from './storage.server';

describe('sanitizeFilename', () => {
  it('replaces anything but letters, digits and dots', () => {
    expect(sanitizeFilename('My Larp (final) v2.pdf')).toEqual('My_Larp__final__v2.pdf');
    expect(sanitizeFilename('Café ☕.pdf')).toEqual('Caf___.pdf');
  });
});

describe('contentDispositionFor', () => {
  it('names the download after the file', () => {
    expect(contentDispositionFor('Rules.pdf')).toEqual(`attachment; filename="Rules.pdf"; filename*=UTF-8''Rules.pdf`);
  });

  it('keeps the header Latin-1 safe for names with other characters, giving the real name percent-encoded', () => {
    const header = contentDispositionFor('Café “Rules”.pdf');

    expect(header).toMatch(/^attachment; filename="Caf_ _Rules_\.pdf"|^attachment; filename="[\x20-\x7e]*"/);
    expect(header).toContain(`filename*=UTF-8''Caf%C3%A9%20%E2%80%9CRules%E2%80%9D.pdf`);
    // every character in the header is one a header value can hold
    expect(/^[\x20-\x7e]*$/.test(header)).toBe(true);
  });

  it('cannot be broken out of by quotes or backslashes in the name', () => {
    const header = contentDispositionFor('a"b\\c.pdf');

    expect(header.split('"')).toHaveLength(3);
    expect(header).toContain(`filename*=UTF-8''a%22b%5Cc.pdf`);
  });
});

describe('keyFromFilepath', () => {
  it.each([
    ['uploads/123-abc/file.pdf', 'uploads/123-abc/file.pdf'],
    ['/larp-library-production/uploads/123-abc/file.pdf', 'uploads/123-abc/file.pdf'],
    ['uploads/123-abc/My%20File.pdf', 'uploads/123-abc/My File.pdf'],
  ])('turns %j into %j', (filepath, key) => {
    expect(keyFromFilepath(filepath, 'larp-library-production')).toEqual(key);
  });
});

describe('createS3Storage', () => {
  const storage = createS3Storage({
    bucket: 'test-bucket',
    client: new S3Client({ region: 'us-east-1', credentials: { accessKeyId: 'AKIATEST', secretAccessKey: 'secret' } }),
  });

  it('builds the public URL of a file from its key', () => {
    expect(storage.publicUrl('uploads/1-a/file.pdf')).toEqual(
      'https://test-bucket.s3.amazonaws.com/uploads/1-a/file.pdf',
    );
  });

  it('signs an upload to a key of its own choosing, in uploads/, with the file’s name in it', async () => {
    const target = await storage.createUploadTarget({ filename: 'My Larp.pdf', contentType: 'application/pdf' });

    expect(target.key).toMatch(new RegExp(`^${UPLOAD_KEY_PREFIX}\\d+-[0-9a-f]{16}/My_Larp\\.pdf$`));
    const url = new URL(target.uploadUrl);
    expect(url.host).toEqual('test-bucket.s3.us-east-1.amazonaws.com');
    expect(decodeURIComponent(url.pathname)).toEqual(`/${target.key}`);
    expect(url.searchParams.get('X-Amz-Algorithm')).toEqual('AWS4-HMAC-SHA256');
    expect(url.searchParams.get('X-Amz-Expires')).toEqual('900');
    expect(url.searchParams.get('X-Amz-Signature')).toMatch(/^[0-9a-f]{64}$/);
  });

  it('signs the headers the browser has to send, and the public-read ACL', async () => {
    const target = await storage.createUploadTarget({ filename: 'Rules.pdf', contentType: 'application/pdf' });

    const url = new URL(target.uploadUrl);
    const signedHeaders = (url.searchParams.get('X-Amz-SignedHeaders') ?? '').split(';');
    expect(signedHeaders).toEqual(expect.arrayContaining(['content-type', 'content-disposition', 'host']));
    expect(target.headers).toEqual({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Rules.pdf"; filename*=UTF-8''Rules.pdf`,
    });
    // the ACL travels in the URL (so the browser needn't send a header for it) or as a signed header; either way it's signed
    expect(url.searchParams.get('x-amz-acl') ?? signedHeaders.find((h) => h === 'x-amz-acl')).toBeTruthy();
  });

  it('gives each upload a different key, even for the same file name', async () => {
    const [first, second] = await Promise.all([
      storage.createUploadTarget({ filename: 'a.pdf', contentType: 'application/pdf' }),
      storage.createUploadTarget({ filename: 'a.pdf', contentType: 'application/pdf' }),
    ]);

    expect(first.key).not.toEqual(second.key);
  });
});
