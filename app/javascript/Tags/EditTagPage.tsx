import {
  ErrorDisplay,
  LoadQueryWrapper,
  useGraphQLConfirm,
} from '@neinteractiveliterature/litform/lib';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import TagFormFields from './TagFormFields';
import { useEditTagQuery } from './queries.generated';
import { Link } from 'react-router-dom';
import { useDeleteTagMutation, useUpdateTagMutation } from './mutations.generated';
import buildTagAttributes from './buildTagAttributes';

function useEditTagQueryFromParams() {
  const { tagId } = useParams();
  return useEditTagQuery({ variables: { id: tagId } });
}

export default LoadQueryWrapper(useEditTagQueryFromParams, function EditTagPage({ data }) {
  const [tag, setTag] = useState(data.tag);
  const [updateTag, { loading: updatingTag, error: updateTagError }] = useUpdateTagMutation();
  const [deleteTag, { loading: deletingTag, error: deleteTagError }] = useDeleteTagMutation();
  const navigate = useNavigate();
  const confirm = useGraphQLConfirm();

  const deleteConfirmed = async () => {
    await deleteTag({ variables: { id: data.tag.id } });
    navigate('/tags');
  };

  const saveChanges = async () => {
    await updateTag({ variables: { id: data.tag.id, tagAttributes: buildTagAttributes(tag) } });
    navigate('/tags');
  };

  return (
    <>
      <header className="d-flex align-items-start">
        <div className="flex-grow-1">
          <h1>Editing tag: {tag.name}</h1>
          <p>
            <Link to={`/projects?tag=${tag.name}`}>
              Used by {tag.projects.totalCount}{' '}
              {tag.projects.totalCount === 1 ? 'project' : 'projects'}
            </Link>
          </p>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-danger"
            disabled={deletingTag}
            onClick={() =>
              confirm({
                action: deleteConfirmed,
                prompt: `Are you sure you want to delete the tag ${data.tag.name}?`,
              })
            }
          >
            Delete tag
          </button>
          <ErrorDisplay graphQLError={deleteTagError} />
        </div>
      </header>

      <TagFormFields tag={tag} onChange={setTag} />

      <button
        type="button"
        className="btn btn-primary"
        disabled={updatingTag}
        onClick={saveChanges}
      >
        Save changes
      </button>

      <ErrorDisplay graphQLError={updateTagError} />
    </>
  );
});
