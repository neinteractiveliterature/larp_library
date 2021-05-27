import {
  BootstrapFormInput,
  FormGroupWithLabel,
  usePropertySetters,
} from '@neinteractiveliterature/litform';
import React from 'react';
import { Tag } from '../graphqlTypes.generated';
import { TagCategoryFragment } from '../TagCategories/queries.generated';
import TagCategorySelector from '../TagCategories/TagCategorySelector';

type TagFormTag = Pick<Tag, 'name'> & {
  tagCategory?: TagCategoryFragment | null;
};

export type TagFormFieldsProps = {
  tag: TagFormTag;
  onChange: React.Dispatch<React.SetStateAction<TagFormTag>>;
};

export default function TagFormFields({ tag, onChange }: TagFormFieldsProps) {
  const [setName, setTagCategory] = usePropertySetters(onChange, 'name', 'tagCategory');

  return (
    <>
      <BootstrapFormInput label="Name" value={tag.name} onTextChange={setName} />
      <FormGroupWithLabel label="Category">
        {(id) => <TagCategorySelector value={tag.tagCategory} onChange={setTagCategory} id={id} />}
      </FormGroupWithLabel>
    </>
  );
}
