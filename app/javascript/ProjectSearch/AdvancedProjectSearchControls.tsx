import {
  BootstrapFormInput,
  FormGroupWithLabel,
  HelpPopover,
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
  const [transientFacilitatorCountLowerBound, setTransientFacilitatorCountLowerBound] =
    useDebouncedState(
      projectSearchParams.facilitatorCountLowerBound,
      (newValue) => setProjectSearchParams({ facilitatorCountLowerBound: newValue }),
      250,
    );
  const [transientFacilitatorCountUpperBound, setTransientFacilitatorCountUpperBound] =
    useDebouncedState(
      projectSearchParams.facilitatorCountUpperBound,
      (newValue) => setProjectSearchParams({ facilitatorCountUpperBound: newValue }),
      250,
    );
  const minPlayerCountId = useUniqueId('min-player-count-');
  const maxPlayerCountId = useUniqueId('max-player-count-');
  const minFacilitatorCountId = useUniqueId('min-facilitator-count-');
  const maxFacilitatorCountId = useUniqueId('max-facilitator-count-');

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
                  isCreatable={false}
                />
              )}
            </FormGroupWithLabel>
          </div>
        </div>

        <div className="row">
          <fieldset className="col-12 col-lg-6">
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
              <div>player(s)</div>
              <HelpPopover iconSet="bootstrap-icons">
                <p>
                  This will find larps that accommodate your requested player count range. It’s
                  inclusive, so if you search for larps that support between 8 and 10 players, larps
                  that support between 5 and 12 players will also come up.
                </p>

                <p className="mb-0">
                  Larps that don’t specify a supported player count won’t come up if you enter
                  numbers in these fields.
                </p>
              </HelpPopover>
            </div>
          </fieldset>

          <fieldset className="col-12 col-lg-6">
            <div className="d-flex align-items-center">
              <label className="form-label mb-0" htmlFor={minFacilitatorCountId}>
                Requires between
              </label>
              <input
                id={minFacilitatorCountId}
                type="number"
                className="mx-1 form-control d-inline-block"
                style={{ maxWidth: '5rem' }}
                value={transientFacilitatorCountLowerBound ?? ''}
                min={0}
                onChange={(event) =>
                  setTransientFacilitatorCountLowerBound(parseIntOrNull(event.target.value))
                }
              />
              <label className="form-label mb-0" htmlFor={maxFacilitatorCountId}>
                and
              </label>
              <input
                id={maxFacilitatorCountId}
                type="number"
                className="mx-1 form-control d-inline-block"
                style={{ maxWidth: '5rem' }}
                value={transientFacilitatorCountUpperBound ?? ''}
                min={0}
                onChange={(event) =>
                  setTransientFacilitatorCountUpperBound(parseIntOrNull(event.target.value))
                }
              />
              <div>facilitator(s)</div>
              <HelpPopover iconSet="bootstrap-icons">
                <p>
                  This will find larps that work with your requested facilitator/GM count range.
                  It’s inclusive, so if you search for larps that require between 3 and 4
                  facilitators, larps that require between 2 and 5 faciliators will also come up.
                </p>

                <p className="mb-0">
                  Larps that don’t specify a required facilitator count won’t come up if you enter
                  numbers in these fields.
                </p>
              </HelpPopover>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}
