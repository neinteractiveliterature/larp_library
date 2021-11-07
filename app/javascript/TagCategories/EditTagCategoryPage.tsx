import {
  ErrorDisplay,
  LoadQueryWrapper,
  useGraphQLConfirm,
} from '@neinteractiveliterature/litform/lib';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import TagCategoryFormFields from './TagCategoryFormFields';
import { useEditTagCategoryQuery } from './queries.generated';
import { useDeleteTagCategoryMutation, useUpdateTagCategoryMutation } from './mutations.generated';
import buildTagCategoryAttributes from './buildTagCategoryAttributes';
import Tag from '../Tags/Tag';

function useEditTagQueryFromParams() {
  const { tagCategoryId } = useParams();
  if (tagCategoryId == null) {
    throw new Error('tagCategoryId param is required');
  }
  return useEditTagCategoryQuery({ variables: { id: tagCategoryId } });
}

export default LoadQueryWrapper(useEditTagQueryFromParams, function EditTagCategoryPage({ data }) {
  const [tagCategory, setTagCategory] = useState(data.tagCategory);
  const [updateTagCategory, { loading: updatingTagCategory, error: updateTagCategoryError }] =
    useUpdateTagCategoryMutation();
  const [deleteTagCategory, { loading: deletingTagCategory, error: deleteTagCategoryError }] =
    useDeleteTagCategoryMutation();
  const navigate = useNavigate();
  const confirm = useGraphQLConfirm();

  const deleteConfirmed = async () => {
    await deleteTagCategory({ variables: { id: data.tagCategory.id } });
    navigate('/tag_categories');
  };

  const saveChanges = async () => {
    await updateTagCategory({
      variables: {
        id: data.tagCategory.id,
        tagCategoryAttributes: buildTagCategoryAttributes(tagCategory),
      },
    });
    navigate('/tag_categories');
  };

  return (
    <>
      <header className="d-flex align-items-start">
        <div className="flex-grow-1">
          <h1>Editing tag category: {tagCategory.name}</h1>
          <ul className="list-inline">
            {tagCategory.tags.map((tag) => (
              <li className="list-inline-item" key={tag.id}>
                <Tag tag={tag} linkTo={`/tags/${tag.id}/edit`} />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-danger"
            disabled={deletingTagCategory}
            onClick={() =>
              confirm({
                action: deleteConfirmed,
                prompt: `Are you sure you want to delete the tag category ${data.tagCategory.name}?`,
              })
            }
          >
            Delete tag category
          </button>
          <ErrorDisplay graphQLError={deleteTagCategoryError} />
        </div>
      </header>

      <TagCategoryFormFields tagCategory={tagCategory} onChange={setTagCategory} />

      <button
        type="button"
        className="btn btn-primary"
        disabled={updatingTagCategory}
        onClick={saveChanges}
      >
        Save changes
      </button>

      <ErrorDisplay graphQLError={updateTagCategoryError} />
    </>
  );
});
