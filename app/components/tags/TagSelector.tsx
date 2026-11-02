import React, { type JSX } from 'react';
import { GroupBase } from 'react-select';
import AsyncSelect, { AsyncProps } from 'react-select/async';
import AsyncCreatableSelect, { AsyncCreatableProps } from 'react-select/async-creatable';
import { v4 as uuidv4 } from 'uuid';
import type { TagCategoryData } from '~/lib/projectData';
import Tag from '~/components/tags/Tag';

/** A tag as the picker deals in it: one from the server, or (for a name typed that no tag has yet) one made up here */
export type TagOption = { id: string | number; name: string; tagCategory?: TagCategoryData | null };

async function queryTags(queryString: string): Promise<TagOption[]> {
  const response = await fetch(`/tags/autocomplete?q=${encodeURIComponent(queryString)}`, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Could not load tags (${response.status})`);
  }
  return response.json();
}

export type TagSelectorProps<IsMulti extends boolean, IsCreatable extends boolean> = {
  value: IsMulti extends true ? TagOption[] : TagOption | null | undefined;
  onChange: IsMulti extends true
    ? React.Dispatch<React.SetStateAction<TagOption[]>>
    : React.Dispatch<React.SetStateAction<TagOption | null>>;
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
  const commonProps: AsyncProps<TagOption, IsMulti, GroupBase<TagOption>> = {
    inputId: id,
    loadOptions: queryTags,
    value,
    getOptionValue: (option: TagOption) => option.name ?? '',
    getOptionLabel: (option: TagOption) => option.name ?? '',

    formatOptionLabel: (option: TagOption) => <Tag tag={option} />,
    filterOption: (option, rawInput) => option.data.name.toUpperCase().startsWith(rawInput.toUpperCase()),
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
    const onChangeMulti = (newValue: TagOption[]) =>
      (onChange as React.Dispatch<React.SetStateAction<TagOption[]>>)([...newValue]);

    if (isCreatable) {
      return (
        <AsyncCreatableSelect<TagOption, true>
          isMulti
          onChange={onChangeMulti}
          getNewOptionData={(inputValue) => ({
            id: uuidv4(),
            name: inputValue,
          })}
          {...(commonProps as AsyncCreatableProps<TagOption, true, GroupBase<TagOption>>)}
        />
      );
    }

    return (
      <AsyncSelect<TagOption, true>
        isMulti
        onChange={onChangeMulti}
        {...(commonProps as AsyncProps<TagOption, true, GroupBase<TagOption>>)}
      />
    );
  }

  if (isCreatable) {
    return (
      <AsyncCreatableSelect<TagOption, false>
        isClearable
        onChange={onChange as React.Dispatch<React.SetStateAction<TagOption | null>>}
        getNewOptionData={(inputValue) => ({
          id: uuidv4(),
          name: inputValue,
        })}
        {...(commonProps as AsyncCreatableProps<TagOption, false, GroupBase<TagOption>>)}
      />
    );
  }

  return (
    <AsyncSelect<TagOption, false>
      isClearable
      onChange={onChange as React.Dispatch<React.SetStateAction<TagOption | null>>}
      {...(commonProps as AsyncProps<TagOption, false, GroupBase<TagOption>>)}
    />
  );
}

export default TagSelector;
