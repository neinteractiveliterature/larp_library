import type { JSX } from 'react';

export type UnapprovedBrandAlertProps = {
  brand: { name: string; approved?: boolean | null };
};

export default function UnapprovedBrandAlert({ brand }: UnapprovedBrandAlertProps): JSX.Element {
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
          {brand.name} is pending approval by a Larp Library admin. You can create projects and add members, but the
          projects will not be viewable until an admin approves it.
        </div>
      </div>
    </div>
  );
}
