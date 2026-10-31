import type { JSX } from 'react';
import { Link } from 'react-router';

export function MarkdownLink({
  href,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ref,
  ...otherProps
}: JSX.IntrinsicElements['a']): JSX.Element {
  return <Link to={href ?? ''} {...otherProps} />;
}
