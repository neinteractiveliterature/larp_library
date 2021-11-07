import { useApolloClient } from '@apollo/client';
import React from 'react';
import { GroupBase } from 'react-select';
import AsyncSelect, { AsyncProps } from 'react-select/async';
import AsyncCreatableSelect, { AsyncCreatableProps } from 'react-select/async-creatable';
import { v4 as uuidv4 } from 'uuid';
import {
  TagAutocompleteQueryData,
  TagAutocompleteQueryDocument,
  TagAutocompleteQueryVariables,
  TagFragment,
} from './queries.generated';
import Tag from './Tag';

export type TagSelectorProps<IsMulti extends boolean, IsCreatable extends boolean> = {
  value: IsMulti extends true ? TagFragment[] : TagFragment | null | undefined;
  onChange: IsMulti extends true
    ? React.Dispatch<React.SetStateAction<TagFragment[]>>
    : React.Dispatch<React.SetStateAction<TagFragment | null>>;
  isMulti: IsMulti;
  isCreatable: IsCreatable;
  id?: string;
};

function TagSelector<IsMulti extends boolean, IsCreatable extends boolean>({
  value,
  onChange,
  id,
  isMulti,
  isCreatable,
}: TagSelectorProps<IsMulti, IsCreatable>): JSX.Element {
  const apolloClient = useApolloClient();

  const queryTags = async (queryString: string) => {
    const result = await apolloClient.query<
      TagAutocompleteQueryData,
      TagAutocompleteQueryVariables
    >({
      query: TagAutocompleteQueryDocument,
      variables: { queryString },
      fetchPolicy: 'network-only',
    });

    return result.data.tags.edges.map((edge) => edge.node);
  };

  const commonProps: AsyncProps<TagFragment, IsMulti, GroupBase<TagFragment>> = {
    id,
    loadOptions: (inputValue: string) => queryTags(inputValue),
    value,
    getOptionValue: (option: TagFragment) => option.name ?? '',
    getOptionLabel: (option: TagFragment) => option.name ?? '',
    // eslint-disable-next-line react/display-name
    formatOptionLabel: (option: TagFragment) => <Tag tag={option} />,
    filterOption: (option, rawInput) =>
      option.data.name.toUpperCase().startsWith(rawInput.toUpperCase()),
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

    if (isCreatable) {
      return (
        <AsyncCreatableSelect<TagFragment, true>
          isMulti
          onChange={onChangeMulti}
          getNewOptionData={(inputValue) => ({
            __typename: 'Tag',
            id: uuidv4(),
            name: inputValue,
          })}
          {...(commonProps as AsyncCreatableProps<TagFragment, true, GroupBase<TagFragment>>)}
        />
      );
    }

    return (
      <AsyncSelect<TagFragment, true>
        isMulti
        onChange={onChangeMulti}
        {...(commonProps as AsyncProps<TagFragment, true, GroupBase<TagFragment>>)}
      />
    );
  }

  if (isCreatable) {
    return (
      <AsyncCreatableSelect<TagFragment, false>
        isClearable
        onChange={onChange as React.Dispatch<React.SetStateAction<TagFragment | null>>}
        getNewOptionData={(inputValue) => ({
          __typename: 'Tag',
          id: uuidv4(),
          name: inputValue,
        })}
        {...(commonProps as AsyncCreatableProps<TagFragment, false, GroupBase<TagFragment>>)}
      />
    );
  }

  return (
    <AsyncSelect<TagFragment, false>
      isClearable
      onChange={onChange as React.Dispatch<React.SetStateAction<TagFragment | null>>}
      {...(commonProps as AsyncProps<TagFragment, false, GroupBase<TagFragment>>)}
    />
  );
}

export default TagSelector;
