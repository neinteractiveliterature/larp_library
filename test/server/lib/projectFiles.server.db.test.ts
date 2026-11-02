// @vitest-environment node
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { asc, eq } from 'drizzle-orm';
import { projectFiles } from '~/.server/db/schema';
import { addMember, createBrand, createProject, createUser, responseStatus } from '../support/factories';
import { db, resetDb, rollbackDb, setupDb, stubDbTransactions, teardownDb } from '../support/db';
import { buildAbility, loadAbility } from '~/.server/lib/authorization.server';
import {
  completeFileUpload,
  deleteProjectFile,
  moveProjectFile,
  requestFileUpload,
} from '~/.server/lib/projectFiles.server';

describe('project files', () => {
  beforeAll(async () => {
    await setupDb();
    stubDbTransactions();
  });
  afterAll(teardownDb);
  beforeEach(resetDb);
  afterEach(rollbackDb);

  /** A licensed project with a member, who's the one acting */
  async function setup({ license = 'cc40_by' as string | null } = {}) {
    const brand = await createBrand();
    const member = await createUser();
    await addMember(brand.id, member.id);
    const project = await createProject(brand.id, { license });
    return { brand, member, project, ability: await loadAbility(member, {}, db) };
  }

  /** Storage that has the files at the given keys, with the given sizes */
  function fakeStorage(files: Record<string, number> = {}) {
    return {
      createUploadTarget: vi.fn(async ({ filename, contentType }: { filename: string; contentType: string }) => ({
        uploadUrl: `https://upload.example.com/${filename}`,
        headers: { 'Content-Type': contentType },
        key: `uploads/1-abc/${filename}`,
      })),
      findFileSize: vi.fn(async (key: string) => files[key] ?? null),
      publicUrl: (key: string) => `https://test-bucket.s3.amazonaws.com/${key}`,
      deleteFile: vi.fn().mockResolvedValue(undefined),
    };
  }

  const positions = async () =>
    (await db.select().from(projectFiles).orderBy(asc(projectFiles.position))).map((f) => [f.filename, f.position]);

  describe('requesting an upload', () => {
    it('gives the browser somewhere to send the file', async () => {
      const { project, ability } = await setup();
      const storage = fakeStorage();

      const result = await requestFileUpload(
        ability,
        project.id,
        { filename: 'Rules.pdf', filetype: 'application/pdf' },
        { db, storage },
      );

      expect(result).toEqual({
        ok: true,
        upload: {
          uploadUrl: 'https://upload.example.com/Rules.pdf',
          headers: { 'Content-Type': 'application/pdf' },
          key: 'uploads/1-abc/Rules.pdf',
        },
      });
    });

    it('treats a file of unknown type as a generic one', async () => {
      const { project, ability } = await setup();
      const storage = fakeStorage();

      await requestFileUpload(ability, project.id, { filename: 'mystery' }, { db, storage });

      expect(storage.createUploadTarget).toHaveBeenCalledWith({
        filename: 'mystery',
        contentType: 'application/octet-stream',
      });
    });

    it('is refused for a project with no license, as Rails refused attaching files to one', async () => {
      const { project, ability } = await setup({ license: null });
      const storage = fakeStorage();

      expect(await requestFileUpload(ability, project.id, { filename: 'a.pdf' }, { db, storage })).toEqual({
        ok: false,
        errors: ['Attaching files is only allowed for projects that specify a license'],
      });
      expect(storage.createUploadTarget).not.toHaveBeenCalled();
    });

    it('needs a filename', async () => {
      const { project, ability } = await setup();

      expect(
        await requestFileUpload(ability, project.id, { filename: '  ' }, { db, storage: fakeStorage() }),
      ).toMatchObject({ ok: false });
    });

    it('is forbidden to anyone who is not a member or a site administrator', async () => {
      const { project } = await setup();
      const outsider = await createUser();

      for (const ability of [await loadAbility(outsider, {}, db), buildAbility(null)]) {
        expect(
          await responseStatus(
            requestFileUpload(ability, project.id, { filename: 'a.pdf' }, { db, storage: fakeStorage() }),
          ),
        ).toEqual(403);
      }
      expect(
        await responseStatus(
          requestFileUpload(buildAbility({ id: 1, admin: true }), 999999, {}, { db, storage: fakeStorage() }),
        ),
      ).toEqual(404);
    });
  });

  describe('completing an upload', () => {
    it('records the file, from what storage has, at the end of the list', async () => {
      const { member, project, ability } = await setup();
      const storage = fakeStorage({ 'uploads/1-abc/first.pdf': 1234, 'uploads/2-def/second.pdf': 99 });

      const first = await completeFileUpload(
        ability,
        member,
        project.id,
        { key: 'uploads/1-abc/first.pdf', filename: 'first.pdf', filetype: 'application/pdf' },
        { db, storage },
      );
      const second = await completeFileUpload(
        ability,
        member,
        project.id,
        { key: 'uploads/2-def/second.pdf', filename: 'second.pdf' },
        { db, storage },
      );

      expect(first.ok && second.ok).toBe(true);
      expect(await positions()).toEqual([
        ['first.pdf', 1],
        ['second.pdf', 2],
      ]);
      expect((await db.select().from(projectFiles).where(eq(projectFiles.filename, 'first.pdf')))[0]).toMatchObject({
        projectId: project.id,
        uploaderId: member.id,
        url: 'https://test-bucket.s3.amazonaws.com/uploads/1-abc/first.pdf',
        filepath: 'uploads/1-abc/first.pdf',
        filetype: 'application/pdf',
        filesize: 1234,
      });
    });

    it('uses the size storage reports, not one the browser claims', async () => {
      const { member, project, ability } = await setup();
      const storage = fakeStorage({ 'uploads/1-abc/a.pdf': 500 });

      await completeFileUpload(
        ability,
        member,
        project.id,
        { key: 'uploads/1-abc/a.pdf', filename: 'a.pdf', filesize: 1 },
        { db, storage },
      );

      expect((await db.select().from(projectFiles))[0].filesize).toEqual(500);
    });

    it.each([
      ['a key outside uploads/', 'private/secret.pdf'],
      ['a key that climbs out of uploads/', 'uploads/../private/secret.pdf'],
      ['a key that is just the prefix of another folder', 'uploadsx/file.pdf'],
    ])('refuses %s', async (_, key) => {
      const { member, project, ability } = await setup();
      const storage = fakeStorage({ [key]: 10 });

      expect(
        await completeFileUpload(ability, member, project.id, { key, filename: 'x.pdf' }, { db, storage }),
      ).toEqual({
        ok: false,
        errors: ['That upload is not valid'],
      });
      expect(await db.$count(projectFiles)).toEqual(0);
    });

    it('refuses a file that is not in storage', async () => {
      const { member, project, ability } = await setup();

      expect(
        await completeFileUpload(
          ability,
          member,
          project.id,
          { key: 'uploads/1-abc/missing.pdf', filename: 'missing.pdf' },
          { db, storage: fakeStorage() },
        ),
      ).toEqual({
        ok: false,
        errors: ['The uploaded file could not be found'],
      });
      expect(await db.$count(projectFiles)).toEqual(0);
    });

    it('will not record the same stored file twice, even for another project', async () => {
      const { member, project, ability, brand } = await setup();
      const otherProject = await createProject(brand.id, { license: 'cc40_by' });
      const storage = fakeStorage({ 'uploads/1-abc/a.pdf': 10 });
      await completeFileUpload(
        ability,
        member,
        project.id,
        { key: 'uploads/1-abc/a.pdf', filename: 'a.pdf' },
        { db, storage },
      );

      expect(
        await completeFileUpload(
          ability,
          member,
          project.id,
          { key: 'uploads/1-abc/a.pdf', filename: 'a.pdf' },
          { db, storage },
        ),
      ).toEqual({
        ok: false,
        errors: ['That file has already been added'],
      });
      expect(
        await completeFileUpload(
          ability,
          member,
          otherProject.id,
          { key: 'uploads/1-abc/a.pdf', filename: 'a.pdf' },
          { db, storage },
        ),
      ).toMatchObject({ ok: false });
      expect(await db.$count(projectFiles)).toEqual(1);
    });

    it('is refused for a project with no license, and forbidden to outsiders', async () => {
      const unlicensed = await setup({ license: null });
      const { member, project } = await setup();
      const outsider = await createUser();
      const storage = fakeStorage({ 'uploads/1-abc/a.pdf': 10 });
      const input = { key: 'uploads/1-abc/a.pdf', filename: 'a.pdf' };

      expect(
        await completeFileUpload(unlicensed.ability, unlicensed.member, unlicensed.project.id, input, { db, storage }),
      ).toMatchObject({ ok: false });
      expect(
        await responseStatus(
          completeFileUpload(await loadAbility(outsider, {}, db), outsider, project.id, input, { db, storage }),
        ),
      ).toEqual(403);
      expect(
        await responseStatus(completeFileUpload(buildAbility(null), member, project.id, input, { db, storage })),
      ).toEqual(403);
      expect(await db.$count(projectFiles)).toEqual(0);
    });
  });

  describe('deleting', () => {
    async function threeFiles() {
      const context = await setup();
      const rows = await db
        .insert(projectFiles)
        .values(
          [1, 2, 3].map((n) => ({
            projectId: context.project.id,
            url: `u${n}`,
            filename: `file${n}.pdf`,
            filesize: n,
            filepath: n === 2 ? '/test-bucket/uploads/2-b/file2.pdf' : `uploads/${n}-x/file${n}.pdf`,
            position: n,
          })),
        )
        .returning();
      return { ...context, files: rows };
    }

    it('removes the file from the project and storage, and closes up the order', async () => {
      const { files, ability } = await threeFiles();
      const storage = fakeStorage();

      await deleteProjectFile(ability, files[0].id, { db, storage });

      expect(await positions()).toEqual([
        ['file2.pdf', 1],
        ['file3.pdf', 2],
      ]);
      expect(storage.deleteFile).toHaveBeenCalledWith('uploads/1-x/file1.pdf');
    });

    it('finds the stored file for one recorded with the bucket name in its path', async () => {
      const { files, ability } = await threeFiles();
      const storage = fakeStorage();

      await deleteProjectFile(ability, files[1].id, { db, storage });

      expect(storage.deleteFile).toHaveBeenCalledWith('uploads/2-b/file2.pdf');
    });

    it('still deletes the file when it cannot be removed from storage', async () => {
      const { files, ability } = await threeFiles();
      const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {});

      await deleteProjectFile(ability, files[0].id, {
        db,
        storage: { deleteFile: vi.fn().mockRejectedValue(new Error('S3 down')) },
      });

      expect(await db.$count(projectFiles)).toEqual(2);
      expect(errorLog).toHaveBeenCalled();
      errorLog.mockRestore();
    });

    it('is forbidden to outsiders and visitors, and 404s for a file that does not exist', async () => {
      const { files } = await threeFiles();
      const outsider = await createUser();
      const storage = fakeStorage();

      expect(
        await responseStatus(deleteProjectFile(await loadAbility(outsider, {}, db), files[0].id, { db, storage })),
      ).toEqual(403);
      expect(await responseStatus(deleteProjectFile(buildAbility(null), files[0].id, { db, storage }))).toEqual(403);
      expect(
        await responseStatus(deleteProjectFile(buildAbility({ id: 1, admin: true }), 999999, { db, storage })),
      ).toEqual(404);
      expect(await db.$count(projectFiles)).toEqual(3);
      expect(storage.deleteFile).not.toHaveBeenCalled();
    });
  });

  describe('moving', () => {
    it('moves a file to a new place and renumbers the rest', async () => {
      const { project, ability } = await setup();
      const rows = await db
        .insert(projectFiles)
        .values(
          ['a', 'b', 'c', 'd'].map((name, index) => ({
            projectId: project.id,
            url: name,
            filename: name,
            filesize: 1,
            filepath: `uploads/${name}`,
            position: index + 1,
          })),
        )
        .returning();

      await moveProjectFile(ability, rows[0].id, 2, { db });
      expect(await positions()).toEqual([
        ['b', 1],
        ['c', 2],
        ['a', 3],
        ['d', 4],
      ]);

      await moveProjectFile(ability, rows[3].id, 0, { db });
      expect(await positions()).toEqual([
        ['d', 1],
        ['b', 2],
        ['c', 3],
        ['a', 4],
      ]);
    });

    it('numbers files that never had a position, in the order they were added', async () => {
      const { project, ability } = await setup();
      const rows = await db
        .insert(projectFiles)
        .values(
          ['a', 'b', 'c'].map((name) => ({
            projectId: project.id,
            url: name,
            filename: name,
            filesize: 1,
            filepath: `uploads/${name}`,
            position: null,
          })),
        )
        .returning();

      await moveProjectFile(ability, rows[2].id, 0, { db });

      expect(await positions()).toEqual([
        ['c', 1],
        ['a', 2],
        ['b', 3],
      ]);
    });

    it('does not touch the order of another project’s files', async () => {
      const { project, ability, brand } = await setup();
      const other = await createProject(brand.id, { license: 'cc40_by' });
      const [mine] = await db
        .insert(projectFiles)
        .values({ projectId: project.id, url: 'm', filename: 'mine', filesize: 1, filepath: 'uploads/m', position: 1 })
        .returning();
      await db
        .insert(projectFiles)
        .values({ projectId: other.id, url: 'o', filename: 'theirs', filesize: 1, filepath: 'uploads/o', position: 7 });

      await moveProjectFile(ability, mine.id, 0, { db });

      expect((await db.select().from(projectFiles).where(eq(projectFiles.filename, 'theirs')))[0].position).toEqual(7);
    });

    it('is forbidden to outsiders, and 404s for a file that does not exist or a bad destination', async () => {
      const { project, ability } = await setup();
      const outsider = await createUser();
      const [file] = await db
        .insert(projectFiles)
        .values({ projectId: project.id, url: 'a', filename: 'a', filesize: 1, filepath: 'uploads/a', position: 1 })
        .returning();

      expect(await responseStatus(moveProjectFile(await loadAbility(outsider, {}, db), file.id, 0, { db }))).toEqual(
        403,
      );
      expect(await responseStatus(moveProjectFile(ability, 999999, 0, { db }))).toEqual(404);
      expect(await responseStatus(moveProjectFile(ability, file.id, 'first', { db }))).toEqual(404);
    });
  });
});
