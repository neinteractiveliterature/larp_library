import { gql } from '@apollo/client';
import { LicenseFieldsFragment } from '../Project/queries';

export const LicensingPageQuery = gql`
  query LicensingPageQuery {
    licenses {
      id
      ...LicenseFieldsFragment
    }
  }

  ${LicenseFieldsFragment}
`;
