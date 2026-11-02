import type { JSX } from 'react';
import { SearchInput, useDebouncedState } from '@neinteractiveliterature/litform';
import Tag from '~/components/tags/Tag';
import type { TagData } from '~/lib/projectData';
import useProjectSearchParams from '~/lib/project-search/useProjectSearchParams';

export type SimpleProjectSearchControlsProps = {
  /** The tag the search is filtered to, if any */
  tag: TagData | null;
};

export default function SimpleProjectSearchControls({ tag }: SimpleProjectSearchControlsProps): JSX.Element {
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
      {tag && (
        <div className="me-0 me-lg-2 mb-2 mb-lg-0">
          <Tag tag={tag} onDismiss={removeTag} />
        </div>
      )}
      <div style={{ minWidth: '150px', width: '33%' }}>
        <SearchInput
          label="Search"
          value={transientQueryString ?? ''}
          onChange={setTransientQueryString}
          iconSet="bootstrap-icons"
        />
      </div>
    </>
  );
}
