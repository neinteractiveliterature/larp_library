// The licenses a project can be published under, in the order they're offered. This used to be Project::LICENSES in the
// Rails app. A project stores only a license's id; everything else here is looked up from it.

export type License = {
  id: string;
  name: string;
  url: string;
  logoUrl: string | null;
  dedicationHtml: string | null;
  /** Allowed, but we'd rather authors chose something else (see the licensing page) */
  discouraged: boolean;
  discouragedReason: string | null;
};

export const LICENSES: readonly License[] = [
  {
    id: 'cc40_by',
    name: 'Creative Commons Attribution 4.0 International',
    url: 'http://creativecommons.org/licenses/by/4.0/',
    logoUrl: 'https://i.creativecommons.org/l/by/4.0/88x31.png',
    dedicationHtml: null,
    discouraged: false,
    discouragedReason: null,
  },
  {
    id: 'cc40_by_sa',
    name: 'Creative Commons Attribution-ShareAlike 4.0 International',
    url: 'http://creativecommons.org/licenses/by-sa/4.0/',
    logoUrl: 'https://i.creativecommons.org/l/by-sa/4.0/88x31.png',
    dedicationHtml: null,
    discouraged: false,
    discouragedReason: null,
  },
  {
    id: 'cc0',
    name: 'Creative Commons CC0 1.0 Universal',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    logoUrl: 'https://licensebuttons.net/l/zero/1.0/88x31.png',
    dedicationHtml:
      'To the extent possible under copyright law, the author has waived all copyright and related or neighboring rights to this work.',
    discouraged: false,
    discouragedReason: null,
  },
  {
    id: 'mit',
    name: 'MIT License',
    url: 'http://opensource.org/licenses/MIT',
    logoUrl: null,
    dedicationHtml: 'This work is licensed under an <a href="http://opensource.org/licenses/MIT">MIT License</a>.',
    discouraged: false,
    discouragedReason: null,
  },
  {
    id: 'public_domain',
    name: 'Public Domain',
    url: 'https://creativecommons.org/publicdomain/mark/1.0/',
    logoUrl: 'https://licensebuttons.net/l/publicdomain/88x31.png',
    dedicationHtml: 'This work is free of known copyright restrictions.',
    discouraged: false,
    discouragedReason: null,
  },
  {
    id: 'cc40_by_nc',
    name: 'Creative Commons Attribution-NonCommercial 4.0 International',
    url: 'http://creativecommons.org/licenses/by-nc/4.0/',
    logoUrl: 'https://i.creativecommons.org/l/by-nc/4.0/88x31.png',
    dedicationHtml: null,
    discouraged: true,
    discouragedReason: 'discouraged, see our licensing page for details',
  },
  {
    id: 'cc40_by_nc_sa',
    name: 'Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International',
    url: 'http://creativecommons.org/licenses/by-nc-sa/4.0/',
    logoUrl: 'https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png',
    dedicationHtml: null,
    discouraged: true,
    discouragedReason: 'discouraged, see our licensing page for details',
  },
  {
    id: 'cc20_by',
    name: 'Creative Commons Attribution 2.0 Generic',
    url: 'http://creativecommons.org/licenses/by/2.0/',
    logoUrl: 'https://i.creativecommons.org/l/by/2.0/88x31.png',
    dedicationHtml: null,
    discouraged: true,
    discouragedReason: 'obsolete, please use 4.0 if possible',
  },
  {
    id: 'cc20_by_sa',
    name: 'Creative Commons Attribution-ShareAlike 2.0 Generic',
    url: 'http://creativecommons.org/licenses/by-sa/2.0/',
    logoUrl: 'https://i.creativecommons.org/l/by-sa/2.0/88x31.png',
    dedicationHtml: null,
    discouraged: true,
    discouragedReason: 'obsolete, please use 4.0 if possible',
  },
  {
    id: 'cc20_by_nc',
    name: 'Creative Commons Attribution-NonCommercial 2.0 Generic',
    url: 'http://creativecommons.org/licenses/by-nc/2.0/',
    logoUrl: 'https://i.creativecommons.org/l/by-nc/2.0/88x31.png',
    dedicationHtml: null,
    discouraged: true,
    discouragedReason: 'obsolete and also discouraged, see our licensing page for details',
  },
  {
    id: 'cc20_by_nc_sa',
    name: 'Creative Commons Attribution-NonCommercial-ShareAlike 2.0 Generic',
    url: 'http://creativecommons.org/licenses/by-nc-sa/2.0/',
    logoUrl: 'https://i.creativecommons.org/l/by-nc-sa/2.0/88x31.png',
    dedicationHtml: null,
    discouraged: true,
    discouragedReason: 'obsolete and also discouraged, see our licensing page for details',
  },
];

const LICENSES_BY_ID = new Map(LICENSES.map((license) => [license.id, license]));

/** The license with this id, or null if there's no such license (or no id) */
export function findLicense(id: string | null | undefined): License | null {
  return (id ? LICENSES_BY_ID.get(id) : undefined) ?? null;
}
