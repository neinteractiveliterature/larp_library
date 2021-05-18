import { useApolloClient } from '@apollo/client';
import React from 'react';
import AsyncSelect from 'react-select/async';
import {
  TagAutocompleteQueryData,
  TagAutocompleteQueryDocument,
  TagAutocompleteQueryVariables,
  TagFragment,
} from './queries.generated';
import Tag from './Tag';

export type TagSelectorProps = {
  value: TagFragment[];
  onChange: React.Dispatch<React.SetStateAction<TagFragment[]>>;
  id?: string;
};

function TagSelector({ value, onChange, id }: TagSelectorProps): JSX.Element {
  const apolloClient = useApolloClient();

  const queryTags = async (queryString: string) => {
    const result = await apolloClient.query<
      TagAutocompleteQueryData,
      TagAutocompleteQueryVariables
    >({
      query: TagAutocompleteQueryDocument,
      variables: { queryString },
    });

    return result.data.tags.nodes;
  };

  return (
    <AsyncSelect<TagFragment, true>
      id={id}
      isMulti
      loadOptions={(inputValue) => queryTags(inputValue)}
      value={value}
      onChange={(newValue) => onChange([...newValue])}
      getOptionValue={(option) => option.name ?? ''}
      getOptionLabel={(option) => option.name ?? ''}
      formatOptionLabel={(option) => <Tag tag={option} />}
      styles={{
        container: (provided) => ({
          ...provided,
          zIndex: 1100,
        }),
        multiValueLabel: (provided) => ({
          ...provided,
          padding: 0,
          paddingLeft: 0,
          fontSize: undefined,
        }),
        multiValue: (provided, state) => {
          return {
            ...provided,
            color: state.data.tagCategory?.textColor ?? '#FFFFFF',
            backgroundColor: state.data.tagCategory?.color ?? '#777777',
          };
        },
      }}
    />
  );
}

export default TagSelector;
