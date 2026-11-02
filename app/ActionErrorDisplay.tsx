import { ErrorDisplay } from '@neinteractiveliterature/litform';
import type { JSX } from 'react';
import { getActionErrors } from './actionErrors';

/** Shows whatever a route action (or a fetcher's) data says the user got wrong, or nothing if it didn't */
export default function ActionErrorDisplay({ data }: { data: unknown }): JSX.Element | null {
  const errors = getActionErrors(data);
  return errors.length > 0 ? <ErrorDisplay stringError={errors.join('; ')} /> : null;
}
