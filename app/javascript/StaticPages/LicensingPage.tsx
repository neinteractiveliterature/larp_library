import { LoadQueryWrapper } from '@neinteractiveliterature/litform/lib';
import { useLicensingPageQuery } from './queries.generated';

export default LoadQueryWrapper(useLicensingPageQuery, function LicensingPage({ data }) {
  return (
    <>
      <h1>Licensing</h1>
      <p>
        Larp Library is designed to provide a set of freely-available larps for anyone to run. Our
        philosophy is that we don’t want GMs to be surprised by strange licensing requirements on
        the larps they would like to run. Therefore, we’ve chosen a set of licenses that we think
        balance authors’ control over their work with GMs’ ability to run a free game unencumbered:
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
        If you want to publish a larp on Larp Library,{' '}
        <strong>you must do so under one of our approved licenses.</strong> This means you must be
        the copyright holder of the entirety of your larp, including any media distributed with it,
        or you must have the copyright holder’s permission to release the work under the license you
        choose.
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
