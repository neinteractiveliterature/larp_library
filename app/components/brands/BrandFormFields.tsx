import { BootstrapFormInput, FormGroupWithLabel, usePropertySetters } from '@neinteractiveliterature/litform';
import React, { type JSX } from 'react';
import MarkdownEditor from '~/components/MarkdownEditor';

export type BrandFormValues = { name: string; description?: string | null };

export type BrandFormFieldsProps = {
  brand: BrandFormValues;
  onChange: React.Dispatch<React.SetStateAction<BrandFormValues>>;
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
