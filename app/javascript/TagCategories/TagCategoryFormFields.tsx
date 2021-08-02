import {
  BootstrapFormInput,
  FormGroupWithLabel,
  usePropertySetters,
} from '@neinteractiveliterature/litform';
import React from 'react';
import ColorPicker from '../ColorPicker';
import { TagCategory } from '../graphqlTypes.generated';
import IconSelect from '../IconSelect';

type TagCategoryFormTagCategory = Pick<TagCategory, 'name' | 'color' | 'icon'>;

export type TagCategoryFormFieldsProps = {
  tagCategory: TagCategoryFormTagCategory;
  onChange: React.Dispatch<React.SetStateAction<TagCategoryFormTagCategory>>;
};

export default function TagCategoryFormFields({
  tagCategory,
  onChange,
}: TagCategoryFormFieldsProps): JSX.Element {
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
            <a
              href="https://icons.getbootstrap.com/#icons"
              target="_blank"
              rel="noreferrer noopener"
            >
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
