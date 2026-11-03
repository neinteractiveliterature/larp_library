import { BootstrapFormInput, FormGroupWithLabel, usePropertySetters } from '@neinteractiveliterature/litform';
import React, { type JSX } from 'react';
import type { TagCategoryData } from '~/lib/projectData';
import TagCategorySelector from '~/components/tag-categories/TagCategorySelector';

export type TagFormValues = {
  name: string;
  tagCategory?: TagCategoryData | null;
};

export type TagFormFieldsProps<T extends TagFormValues = TagFormValues> = {
  tag: T;
  onChange: React.Dispatch<React.SetStateAction<T>>;
};

export default function TagFormFields<T extends TagFormValues>({ tag, onChange }: TagFormFieldsProps<T>): JSX.Element {
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
