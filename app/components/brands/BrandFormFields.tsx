import { BootstrapFormInput, FormGroupWithLabel, usePropertySetters } from '@neinteractiveliterature/litform';
import React, { type JSX } from 'react';
import MarkdownEditor from '~/components/MarkdownEditor';

export type BrandFormValues = { name: string; description?: string | null };

export type BrandFormFieldsProps<T extends BrandFormValues = BrandFormValues> = {
  brand: T;
  onChange: React.Dispatch<React.SetStateAction<T>>;
};

export default function BrandFormFields<T extends BrandFormValues>({
  brand,
  onChange,
}: BrandFormFieldsProps<T>): JSX.Element {
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
