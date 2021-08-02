import { LoadQueryWrapper } from '@neinteractiveliterature/litform/lib';
import { useLicensingPageQuery } from './queries.generated';

export default LoadQueryWrapper(useLicensingPageQuery, function LicensingPage({ data }) {
  return (
    <>
      <h1>Licensing</h1>

      <p>
        Larps are copyrighted material. Larp Library is a project of New England Interactive
        Literature, a nonprofit based in the United States. Under US copyright law, the creator of a
        work owns the copyright to their work by default, regardless of whether they register it
        with the US Patent &amp; Trademark Office or not.
      </p>

      <p>
        This means that in order for someone else to legally run your larp, you must grant them a
        license to do so. (In practice, this often doesn’t happen, and larps are run by handshake
        agreement, and as long as nobody actually takes anybody to court, this can work out fine.)
      </p>

      <p>
        If you upload files to Larp Library, New England Interactive Literature pays for hosting
        them and the associated bandwidth costs, which legally means NEIL is redistributing your
        copyrighted work. Therefore, we offer two options for licensing your larps on Larp Library:
      </p>

      <ul>
        <li>You can choose an allowed license, and we’ll host your files for people to download</li>
        <li>You can host your files elsewhere and link to them from your Larp Library page</li>
      </ul>

      <h2>Licenses allowed for Larp Library-hosted content</h2>
      <p>
        Larp Library hosts a set of freely-available larps for anyone to run. Our philosophy is that
        we don’t want GMs to be surprised by strange licensing requirements on the larps they would
        like to run. Therefore, we’ve chosen a set of licenses that we think balance authors’
        control over their work with GMs’ ability to run a free game unencumbered:
      </p>
      <ul>
        {data.licenses.map((license) => (
          <li key={license.id}>
            <a href={license.url} target="_blank" rel="noreferrer noopener">
              {license.name}
            </a>
            {license.discouraged &&
              (license.discouragedReason
                ? ` (${license.discouragedReason.replace(
                    /, see our licensing page for details/,
                    '',
                  )})`
                : ' (discouraged)')}
          </li>
        ))}
      </ul>
      <p>
        These copyright licenses are chosen deliberately, and reflect a range of rights grants.
        Creative Commons Attribution ShareAlike is the most restrictive: it requires licensees to
        give credit to authors and, if they make modifications to the larp, to make those
        modifications publicly available under the same license. Creative Commons Attribution, by
        contrast, allows licensees to make modifications without publishing their version at all, or
        to relicense the work under a different license (but they still must give credit to the
        authors). The other choices have no attribution requirement and allow relicensing.
      </p>
      <p>
        If you want to use oen of these licenses, you must be the copyright holder of the entirety
        of your larp, including any media distributed with it, or you must have the copyright
        holder’s permission to release the work under the license you choose.
      </p>

      <h2>Using a different license (or not specifying a license)</h2>
      <p>
        You can publish larps on Larp Library without a license (or under a license we don’t
        support), with one restriction:{' '}
        <strong>Larp Library will not host files for people to download.</strong> Larp Library
        allows you to specify links instead of, or in addition to, uploading files, so you can host
        your larp content elsewhere on the web and link to it from Larp Library.
      </p>
      <p>
        If your larp writing team already has a web site, that’s a good option for where to host
        content that you don’t want to upload here. You can also use file hosting services like
        Google Drive, Dropbox, etc. and link to them from Larp Library. Or, if you want to make your
        larp available but only by request, you could link to a Google Form or some other similar
        tool.
      </p>

      <h2>Licenses we discourage</h2>
      <p>
        <strong>Creative Commons Non-Commercial variants</strong> are good licenses, but probably
        not for larps. A conservative reading of the license would prohibit running a larp at a
        convention for which there is a registration fee, which would be a surprising requirement
        for most GMs. We do allow CC Non-Commercial because many existing larps are licensed under
        it, but we highly encourage you to consider a different CC variant.
      </p>
      <p>
        <strong>The LARPA and ILF GameBank Licenses</strong> have some serious issues, in our
        opinion. They fail to grant some very important rights, namely: the right to modify the work
        (almost everyone modifies larps at least a little when running them) and the right to
        redistribute the work. They also impose fairly onerous accounting requirements on GMs by
        requiring them not to make a profit, but allowing them to charge for materials. (If you run
        a game under one of these licenses, be sure to save your receipts!)
      </p>
      <p>
        <strong>The GNU General Public License</strong> is designed for software, not written
        materials, and imposes a great deal of requirements that are specific to software and would
        be hard to meet for larps. (For example, it’s hard to figure out what “source code” means in
        the context of a larp written in Microsoft Word.) The MIT License, which we do allow, is
        also written for software, but imposes no such requirements. If you want a GPL-like set of
        restrictions for a written work, the closest thing is probably a Creative Commons ShareAlike
        variant.
      </p>
      <p>
        <strong>The GNU Free Documentation License</strong> is designed for written works, but
        imposes an onerous set of change-tracking requirements we feel would be much more difficult
        to meet for larp than for documentation (the intended use of that license).
      </p>
      <p>
        <strong>Custom licenses</strong> are, in general, not a great idea unless you have a lawyer
        to draft or consult on it. If you have a license that’s been drafted and/or approved by a
        legal professional, and you think it meets our goals, please contact us to discuss adding
        it.
      </p>
    </>
  );
});
