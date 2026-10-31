import { screen } from '@testing-library/react';

import AboutPage from './AboutPage';
import LicensingPage from './LicensingPage';
import { LicensingPageQueryDocument } from './queries.generated';
import { buildLicense, resetFixtureIds } from '../../../test/javascript/fixtures';
import { renderPage } from '../../../test/javascript/testUtils';

describe('AboutPage', () => {
  it('credits the team and links to the source', () => {
    renderPage(<AboutPage />);

    expect(screen.getByRole('heading', { name: 'About Us' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'New England Interactive Literature' })).toHaveAttribute(
      'href',
      'http://interactiveliterature.org',
    );
    expect(screen.getByRole('link', { name: 'on Github' })).toHaveAttribute(
      'href',
      'https://github.com/neinteractiveliterature/larp_library',
    );
  });
});

describe('LicensingPage', () => {
  beforeEach(() => resetFixtureIds());

  it('lists the licenses, flagging the discouraged ones', async () => {
    renderPage(<LicensingPage />, {
      mocks: [
        {
          request: { query: LicensingPageQueryDocument },
          result: {
            data: {
              licenses: [
                buildLicense({ name: 'CC BY-SA', url: 'https://example.com/by-sa' }),
                buildLicense({ name: 'CC BY-NC', discouraged: true, discouragedReason: null }),
                buildLicense({ name: 'MIT', discouraged: true, discouragedReason: 'it is for software.' }),
              ],
            },
          },
        },
      ],
    });

    expect(await screen.findByRole('heading', { name: 'Licensing' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'CC BY-SA' })).toHaveAttribute('href', 'https://example.com/by-sa');
    expect(screen.getByRole('link', { name: 'CC BY-NC' }).closest('li')).toHaveTextContent('CC BY-NC (discouraged)');
    expect(screen.getByRole('link', { name: 'MIT' }).closest('li')).toHaveTextContent(/MIT \(.*it is for software/);
  });
});
