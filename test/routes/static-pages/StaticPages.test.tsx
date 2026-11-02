import { screen } from '@testing-library/react';

import AboutPage from '~/routes/static-pages/AboutPage';
import LicensingPage from '~/routes/static-pages/LicensingPage';
import { renderPage } from '../../testUtils';

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
  it('lists the licenses, flagging the discouraged ones', () => {
    renderPage(<LicensingPage />);

    expect(screen.getByRole('heading', { name: 'Licensing' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Creative Commons Attribution 4.0 International' })).toHaveAttribute(
      'href',
      'http://creativecommons.org/licenses/by/4.0/',
    );
    // discouraged with the default reason
    expect(
      screen.getByRole('link', { name: 'Creative Commons Attribution-NonCommercial 4.0 International' }).closest('li'),
    ).toHaveTextContent('Creative Commons Attribution-NonCommercial 4.0 International (discouraged)');
    // discouraged with its own reason
    expect(
      screen.getByRole('link', { name: 'Creative Commons Attribution 2.0 Generic' }).closest('li'),
    ).toHaveTextContent(/Attribution 2\.0 Generic \(obsolete, please use 4\.0 if possible\)/);
  });
});
