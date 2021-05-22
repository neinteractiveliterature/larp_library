import {
  BootstrapFormInput,
  FormGroupWithLabel,
  usePropertySetters,
} from '@neinteractiveliterature/litform';
import React from 'react';
import { Brand } from '../graphqlTypes.generated';
import MarkdownEditor from '../MarkdownEditor';

type BrandFormBrand = Pick<Brand, 'name' | 'description'>;

export type BrandFormFieldsProps = {
  brand: BrandFormBrand;
  onChange: React.Dispatch<React.SetStateAction<BrandFormBrand>>;
};

export default function BrandFormFields({ brand, onChange }: BrandFormFieldsProps): JSX.Element {
  const [setName, setDescription] = usePropertySetters(onChange, 'name', 'description');

  return (
    <>
      <BootstrapFormInput
        label="Name"
        helpText="Your team’s name, or your name if you create larps on your own"
        value={brand.name}
        onTextChange={setName}
      />
      <FormGroupWithLabel
        label={
          <>
            Description <small>(Markdown allowed)</small>
          </>
        }
      >
        {() => <MarkdownEditor value={brand.description ?? ''} onChange={setDescription} />}
      </FormGroupWithLabel>
    </>
  );
}
