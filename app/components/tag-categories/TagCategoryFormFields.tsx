import { BootstrapFormInput, FormGroupWithLabel, usePropertySetters } from '@neinteractiveliterature/litform';
import React, { type JSX } from 'react';
import ColorPicker from '~/components/ColorPicker';
import IconSelect from '~/components/IconSelect';

export type TagCategoryFormValues = {
  name: string;
  color?: string | null;
  icon?: string | null;
};

export type TagCategoryFormFieldsProps<T extends TagCategoryFormValues = TagCategoryFormValues> = {
  tagCategory: T;
  onChange: React.Dispatch<React.SetStateAction<T>>;
};

export default function TagCategoryFormFields<T extends TagCategoryFormValues>({
  tagCategory,
  onChange,
}: TagCategoryFormFieldsProps<T>): JSX.Element {
  const [setName, setColor, setIcon] = usePropertySetters(onChange, 'name', 'color', 'icon');

  return (
    <>
      <BootstrapFormInput label="Name" value={tagCategory.name} onTextChange={setName} />
      <FormGroupWithLabel label="Color">
        {() => <ColorPicker value={tagCategory.color} onChange={setColor} />}
      </FormGroupWithLabel>
      <FormGroupWithLabel
        label="Icon"
        helpText={
          <>
            Use{' '}
            <a href="https://icons.getbootstrap.com/#icons" target="_blank" rel="noreferrer noopener">
              Bootstrap Icons icon names
            </a>
          </>
        }
      >
        {(id) => <IconSelect id={id} value={tagCategory.icon ?? undefined} onChange={setIcon} />}
      </FormGroupWithLabel>
    </>
  );
}
