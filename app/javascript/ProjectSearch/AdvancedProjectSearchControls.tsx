import {
  BootstrapFormInput,
  FormGroupWithLabel,
  parseIntOrNull,
  useDebouncedState,
  useUniqueId,
} from '@neinteractiveliterature/litform';
import TagSelector from '../Tags/TagSelector';
import { ProjectSearchQueryData } from './queries.generated';
import useProjectSearchParams from './useProjectSearchParams';

export type AdvancedProjectSearchControlsProps = {
  data: ProjectSearchQueryData | null | undefined;
  switchToSimpleSearch: () => void;
};

export default function AdvancedProjectSearchControls({
  data,
  switchToSimpleSearch,
}: AdvancedProjectSearchControlsProps): JSX.Element {
  const [projectSearchParams, setProjectSearchParams] = useProjectSearchParams();
  const [transientQueryString, setTransientQueryString] = useDebouncedState(
    projectSearchParams.queryString,
    (newValue) => setProjectSearchParams({ queryString: newValue }),
    250,
  );
  const [transientTitle, setTransientTitle] = useDebouncedState(
    projectSearchParams.title,
    (newValue) => setProjectSearchParams({ title: newValue }),
    250,
  );
  const [transientAuthors, setTransientAuthors] = useDebouncedState(
    projectSearchParams.authors,
    (newValue) => setProjectSearchParams({ authors: newValue }),
    250,
  );
  const [transientPlayerCountLowerBound, setTransientPlayerCountLowerBound] = useDebouncedState(
    projectSearchParams.playerCountLowerBound,
    (newValue) => setProjectSearchParams({ playerCountLowerBound: newValue }),
    250,
  );
  const [transientPlayerCountUpperBound, setTransientPlayerCountUpperBound] = useDebouncedState(
    projectSearchParams.playerCountUpperBound,
    (newValue) => setProjectSearchParams({ playerCountUpperBound: newValue }),
    250,
  );
  const minPlayerCountId = useUniqueId('min-player-count-');
  const maxPlayerCountId = useUniqueId('max-player-count-');

  return (
    <div className="card mb-2">
      <div className="card-header">
        <div className="d-flex align-items-center">
          <div className="flex-grow-1">Advanced search</div>
          <button className="btn btn-secondary btn-sm" type="button" onClick={switchToSimpleSearch}>
            Switch to simple search
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="d-flex flex-wrap">
          <div className="col-12">
            <BootstrapFormInput
              label="Search (all fields)"
              value={transientQueryString ?? ''}
              onTextChange={setTransientQueryString}
            />
          </div>

          <div className="col-12 col-lg-6 pe-lg-1 col-xl-4">
            <BootstrapFormInput
              label="Title"
              value={transientTitle ?? ''}
              onTextChange={setTransientTitle}
            />
          </div>

          <div className="col-12 col-lg-6 ps-lg-1 col-xl-4 pe-xl-1">
            <BootstrapFormInput
              label="Author(s)"
              value={transientAuthors ?? ''}
              onTextChange={setTransientAuthors}
            />
          </div>

          <div className="col-12 col-lg-12 col-xl-4 ps-xl-1">
            <FormGroupWithLabel label="Tag">
              {(id) => (
                <TagSelector
                  id={id}
                  value={data?.tagByName}
                  onChange={(newTag) => setProjectSearchParams({ tag: newTag?.name })}
                  isMulti={false}
                />
              )}
            </FormGroupWithLabel>
          </div>
        </div>

        <fieldset>
          <div className="d-flex align-items-center">
            <label className="form-label mb-0" htmlFor={minPlayerCountId}>
              Supports between
            </label>
            <input
              id={minPlayerCountId}
              type="number"
              className="mx-1 form-control d-inline-block"
              style={{ maxWidth: '5rem' }}
              value={transientPlayerCountLowerBound ?? ''}
              min={0}
              onChange={(event) =>
                setTransientPlayerCountLowerBound(parseIntOrNull(event.target.value))
              }
            />
            <label className="form-label mb-0" htmlFor={maxPlayerCountId}>
              and
            </label>
            <input
              id={maxPlayerCountId}
              type="number"
              className="mx-1 form-control d-inline-block"
              style={{ maxWidth: '5rem' }}
              value={transientPlayerCountUpperBound ?? ''}
              min={0}
              onChange={(event) =>
                setTransientPlayerCountUpperBound(parseIntOrNull(event.target.value))
              }
            />
            <div>players</div>
          </div>
        </fieldset>
      </div>
    </div>
  );
}
