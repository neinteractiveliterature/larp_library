import { ErrorDisplay } from '@neinteractiveliterature/litform/lib';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import buildTagAttributes from './buildTagAttributes';
import { useCreateTagMutation } from './mutations.generated';
import TagFormFields, { TagFormFieldsProps } from './TagFormFields';

export default function NewTagPage(): JSX.Element {
  const [tag, setTag] = useState<TagFormFieldsProps['tag']>({
    name: '',
  });
  const [createTag, { loading, error }] = useCreateTagMutation();
  const navigate = useNavigate();

  const createClicked = async () => {
    await createTag({ variables: { tagAttributes: buildTagAttributes(tag) } });
    navigate('/tags');
  };

  return (
    <>
      <header className="d-flex">
        <h1>Create a new tag</h1>
      </header>

      <TagFormFields tag={tag} onChange={setTag} />

      <button type="button" className="btn btn-primary" disabled={loading} onClick={createClicked}>
        Create tag
      </button>

      <ErrorDisplay graphQLError={error} />
    </>
  );
}
