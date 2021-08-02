import { Brand } from '../graphqlTypes.generated';

export type UnapprovedBrandAlertProps = {
  brand: Pick<Brand, 'name' | 'approved'>;
};

export default function UnapprovedBrandAlert({ brand }: UnapprovedBrandAlertProps): JSX.Element {
  // null and undefined approved values just mean the user doesn't have the ability to
  // manage this brand, so don't show this alert
  if (brand.approved !== false) {
    return <></>;
  }

  return (
    <div className="alert alert-warning">
      <div className="d-flex align-items-center">
        <div className="h1 me-3 mb-0">
          <i className="bi-exclamation-triangle-fill" />
        </div>
        <div>
          {brand.name} is pending approval by a Larp Library admin. You can create projects and add
          members, but the projects will not be viewable until an admin approves it.
        </div>
      </div>
    </div>
  );
}
