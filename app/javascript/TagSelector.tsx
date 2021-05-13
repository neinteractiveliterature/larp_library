import React from "react";
import AsyncSelect from "react-select/async";
import fetchJSON from "./fetchJSON";
import Tag, { TagAttributes } from "./Tag";

function fetchTags(query: string) {
  const params = new URLSearchParams({ q: query });
  return fetchJSON(`/tags?${params.toString()}`, {
    headers: {
      Accept: "application/json",
    },
  });
}

export type TagSelectorProps = {
  value: TagAttributes[];
  onChange: React.Dispatch<React.SetStateAction<TagAttributes[]>>;
};

function TagSelector({ value, onChange }: TagSelectorProps): JSX.Element {
  return (
    <AsyncSelect
      isMulti
      loadOptions={(inputValue) => fetchTags(inputValue)}
      value={value}
      onChange={(newValue) => onChange([...newValue])}
      getOptionValue={(option) => option.name}
      getOptionLabel={(option) => option.name}
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
            color: state.data.text_color,
            backgroundColor: state.data.color,
          };
        },
      }}
    />
  );
}

export default TagSelector;
