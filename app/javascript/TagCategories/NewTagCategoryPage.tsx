import { ErrorDisplay } from '@neinteractiveliterature/litform/lib';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import buildTagCategoryAttributes from './buildTagCategoryAttributes';
import { useCreateTagCategoryMutation } from './mutations.generated';
import TagCategoryFormFields, { TagCategoryFormFieldsProps } from './TagCategoryFormFields';

export default function NewTagCategoryPage(): JSX.Element {
  const [tagCategory, setTagCategory] = useState<TagCategoryFormFieldsProps['tagCategory']>({
    name: '',
  });
  const [createTagCategory, { loading, error }] = useCreateTagCategoryMutation();
  const navigate = useNavigate();

  const createClicked = async () => {
    await createTagCategory({
      variables: { tagCategoryAttributes: buildTagCategoryAttributes(tagCategory) },
    });
    navigate('/tag_categories');
  };

  return (
    <>
      <header className="d-flex">
        <h1>Create a new tag category</h1>
      </header>

      <TagCategoryFormFields tagCategory={tagCategory} onChange={setTagCategory} />

      <button type="button" className="btn btn-primary" disabled={loading} onClick={createClicked}>
        Create tag category
      </button>

      <ErrorDisplay graphQLError={error} />
    </>
  );
}
