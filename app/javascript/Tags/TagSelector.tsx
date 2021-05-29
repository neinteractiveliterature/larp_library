import { useApolloClient } from '@apollo/client';
import React from 'react';
import AsyncSelect, { Props as AsyncSelectProps } from 'react-select/async';
import {
  TagAutocompleteQueryData,
  TagAutocompleteQueryDocument,
  TagAutocompleteQueryVariables,
  TagFragment,
} from './queries.generated';
import Tag from './Tag';

export type TagSelectorProps<IsMulti extends boolean> = {
  value: IsMulti extends true ? TagFragment[] : TagFragment | null | undefined;
  onChange: IsMulti extends true
    ? React.Dispatch<React.SetStateAction<TagFragment[]>>
    : React.Dispatch<React.SetStateAction<TagFragment | null>>;
  isMulti: IsMulti;
  id?: string;
};

function TagSelector<IsMulti extends boolean>({
  value,
  onChange,
  id,
  isMulti,
}: TagSelectorProps<IsMulti>): JSX.Element {
  const apolloClient = useApolloClient();

  const queryTags = async (queryString: string) => {
    const result = await apolloClient.query<
      TagAutocompleteQueryData,
      TagAutocompleteQueryVariables
    >({
      query: TagAutocompleteQueryDocument,
      variables: { queryString },
    });

    return result.data.tags.edges.map((edge) => edge.node);
  };

  const commonProps: AsyncSelectProps<TagFragment, IsMulti> = {
    id,
    loadOptions: (inputValue: string) => queryTags(inputValue),
    value,
    getOptionValue: (option: TagFragment) => option.name ?? '',
    getOptionLabel: (option: TagFragment) => option.name ?? '',
    // eslint-disable-next-line react/display-name
    formatOptionLabel: (option: TagFragment) => <Tag tag={option} />,
    styles: {
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
      singleValue: (provided, state) => {
        return {
          ...provided,
          color: state.data.tagCategory?.textColor ?? '#FFFFFF',
          backgroundColor: state.data.tagCategory?.color ?? '#777777',
        };
      },
      multiValue: (provided, state) => {
        return {
          ...provided,
          color: state.data.tagCategory?.textColor ?? '#FFFFFF',
          backgroundColor: state.data.tagCategory?.color ?? '#777777',
        };
      },
    },
  };

  if (isMulti) {
    const onChangeMulti = (newValue: TagFragment[]) =>
      (onChange as React.Dispatch<React.SetStateAction<TagFragment[]>>)([...newValue]);
    return (
      <AsyncSelect<TagFragment, true>
        isMulti
        onChange={onChangeMulti}
        {...(commonProps as AsyncSelectProps<TagFragment, true>)}
      />
    );
  }

  return (
    <AsyncSelect<TagFragment, false>
      isClearable
      onChange={onChange as React.Dispatch<React.SetStateAction<TagFragment | null>>}
      {...(commonProps as AsyncSelectProps<TagFragment, false>)}
    />
  );
}

export default TagSelector;
