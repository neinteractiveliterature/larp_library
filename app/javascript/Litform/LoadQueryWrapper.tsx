import { QueryHookOptions, QueryResult } from '@apollo/client';
import ErrorDisplay from './ErrorDisplay';
import PageLoadingIndicator from './PageLoadingIndicator';

export default function LoadQueryWrapper<TData, TProps>(
  useLoadData: (baseOptions?: QueryHookOptions<TData, Record<string, never>>) => QueryResult<TData>,
  WrappedComponent: React.ComponentType<TProps & { data: TData }>,
): (props: TProps) => JSX.Element {
  const Wrapper = (props: TProps) => {
    const { data, loading, error } = useLoadData();

    if (loading) {
      return <PageLoadingIndicator visible />;
    }

    if (error) {
      return <ErrorDisplay graphQLError={error} />;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return <WrappedComponent data={data!} {...props} />;
  };

  const wrappedComponentDisplayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  Wrapper.displayName = `LoadQueryWrapper<${wrappedComponentDisplayName}>`;

  return Wrapper;
}
