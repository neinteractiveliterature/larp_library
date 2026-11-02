import { BootstrapFormInput, FormGroupWithLabel, usePropertySetters } from '@neinteractiveliterature/litform';
import React, { type JSX } from 'react';
import ColorPicker from '~/ColorPicker';
import IconSelect from '~/IconSelect';

export type TagCategoryFormValues = {
  name: string;
  color?: string | null;
  icon?: string | null;
};

export type TagCategoryFormFieldsProps = {
  tagCategory: TagCategoryFormValues;
  onChange: React.Dispatch<React.SetStateAction<TagCategoryFormValues>>;
};

export default function TagCategoryFormFields({ tagCategory, onChange }: TagCategoryFormFieldsProps): JSX.Element {
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
