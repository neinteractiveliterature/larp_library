export type LoadingIndicatorProps = { size?: number };

function LoadingIndicator({ size = 5 }: LoadingIndicatorProps): JSX.Element {
  return (
    <div className={`d-inline-block display-${size ?? 5}`} aria-label="Loading...">
      <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true" />
    </div>
  );
}

export default LoadingIndicator;
