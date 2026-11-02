import React, { type JSX } from 'react';
import AsyncSelect from 'react-select/async';
import type { TagCategoryData } from '~/lib/projectData';
import TagCategory from '~/components/tag-categories/TagCategory';

export type TagCategorySelectorProps = {
  value: TagCategoryData | null | undefined;
  onChange: React.Dispatch<React.SetStateAction<TagCategoryData | null | undefined>>;
  id?: string;
};

async function queryTagCategories(queryString: string): Promise<TagCategoryData[]> {
  const response = await fetch(`/tag_categories/autocomplete?q=${encodeURIComponent(queryString)}`, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Could not load tag categories (${response.status})`);
  }
  return response.json();
}

function TagCategorySelector({ value, onChange, id }: TagCategorySelectorProps): JSX.Element {
  return (
    <AsyncSelect<TagCategoryData>
      inputId={id}
      isClearable
      defaultOptions={true} // preload tag categories for blank query
      loadOptions={queryTagCategories}
      value={value}
      onChange={(newValue) => onChange(newValue)}
      getOptionValue={(option) => option.name}
      getOptionLabel={(option) => option.name}
      formatOptionLabel={(option) => <TagCategory tagCategory={option} />}
      styles={{
        container: (provided) => ({
          ...provided,
          zIndex: 1100,
        }),
        singleValue: (provided, state) => {
          return {
            ...provided,
            color: state.data.textColor,
            backgroundColor: state.data.color,
          };
        },
      }}
    />
  );
}

export default TagCategorySelector;
