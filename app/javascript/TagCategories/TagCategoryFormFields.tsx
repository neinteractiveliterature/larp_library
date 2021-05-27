import {
  BootstrapFormInput,
  FormGroupWithLabel,
  usePropertySetters,
} from '@neinteractiveliterature/litform';
import React from 'react';
import ColorPicker from '../ColorPicker';
import { TagCategory } from '../graphqlTypes.generated';

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
      <BootstrapFormInput
        label={
          <>
            Icon <i className={`fa fa-${tagCategory.icon}`} />
          </>
        }
        helpText={
          <>
            Use{' '}
            <a href="https://fontawesome.com/v4.7/icons/" target="_blank" rel="noreferrer noopener">
              Font Awesome 4 icon names
            </a>
          </>
        }
        value={tagCategory.icon ?? ''}
        onTextChange={setIcon}
      />
    </>
  );
}
