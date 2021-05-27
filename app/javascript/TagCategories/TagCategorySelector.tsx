import { useApolloClient } from '@apollo/client';
import React from 'react';
import AsyncSelect from 'react-select/async';
import {
  TagCategoryAutocompleteQueryData,
  TagCategoryAutocompleteQueryDocument,
  TagCategoryAutocompleteQueryVariables,
} from './queries.generated';
import TagCategory from './TagCategory';
import { TagCategoryFragment } from './TagCategoryFragment.generated';

export type TagCategorySelectorProps = {
  value: TagCategoryFragment | null | undefined;
  onChange: React.Dispatch<React.SetStateAction<TagCategoryFragment | null | undefined>>;
  id?: string;
};

function TagCategorySelector({ value, onChange, id }: TagCategorySelectorProps): JSX.Element {
  const apolloClient = useApolloClient();

  const queryTagCategories = async (queryString: string) => {
    const result = await apolloClient.query<
      TagCategoryAutocompleteQueryData,
      TagCategoryAutocompleteQueryVariables
    >({
      query: TagCategoryAutocompleteQueryDocument,
      variables: { queryString },
    });

    return result.data.tagCategories.edges.map((edge) => edge.node);
  };

  return (
    <AsyncSelect<TagCategoryFragment>
      id={id}
      isClearable
      defaultOptions={true} // preload tag categories for blank query
      loadOptions={(inputValue) => queryTagCategories(inputValue)}
      value={value}
      onChange={(newValue) => onChange(newValue)}
      getOptionValue={(option) => option.name ?? ''}
      getOptionLabel={(option) => option.name ?? ''}
      formatOptionLabel={(option) => <TagCategory tagCategory={option} />}
      styles={{
        container: (provided) => ({
          ...provided,
          zIndex: 1100,
        }),
        singleValue: (provided, state) => {
          return {
            ...provided,
            color: state.data.textColor ?? '#FFFFFF',
            backgroundColor: state.data.color ?? '#777777',
          };
        },
      }}
    />
  );
}

export default TagCategorySelector;
