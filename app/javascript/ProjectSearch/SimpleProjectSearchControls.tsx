import { SearchInput, useDebouncedState } from '@neinteractiveliterature/litform';
import Tag from '../Tags/Tag';
import { ProjectSearchQueryData } from './queries.generated';
import useProjectSearchParams from './useProjectSearchParams';

export type SimpleProjectSearchControlsProps = {
  data: ProjectSearchQueryData | null | undefined;
};

export default function SimpleProjectSearchControls({
  data,
}: SimpleProjectSearchControlsProps): JSX.Element {
  const [projectSearchParams, setProjectSearchParams] = useProjectSearchParams();
  const [transientQueryString, setTransientQueryString] = useDebouncedState(
    projectSearchParams.queryString,
    (newValue) => setProjectSearchParams({ queryString: newValue }),
    250,
  );

  const removeTag = () => {
    setProjectSearchParams({ tag: undefined });
  };

  return (
    <>
      {data?.tagByName && (
        <div className="me-0 me-lg-2 mb-2 mb-lg-0">
          <Tag tag={data.tagByName} onDismiss={removeTag} />
        </div>
      )}
      <div style={{ minWidth: '150px', width: '33%' }}>
        <SearchInput
          label="Search"
          value={transientQueryString ?? ''}
          onChange={setTransientQueryString}
        />
      </div>
    </>
  );
}
