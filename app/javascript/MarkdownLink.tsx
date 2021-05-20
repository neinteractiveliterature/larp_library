import { IntrinsicElements } from 'react-markdown/src/ast-to-react';
import { Link } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function MarkdownLink({ href, ref, ...otherProps }: IntrinsicElements['a']): JSX.Element {
  return <Link to={href ?? ''} {...otherProps} />;
}
