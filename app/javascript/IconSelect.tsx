import Select from 'react-select';
import IconsData from 'bootstrap-icons/font/bootstrap-icons.json';
import React, { useState } from 'react';
import escapeRegExp from 'lodash/escapeRegExp';

type IconOption = { label: string; value: string };
const ICON_OPTIONS: IconOption[] = Object.keys(IconsData).map((iconName) => ({
  label: iconName,
  value: iconName,
}));

export type IconSelectProps = {
  value: string | undefined;
  onChange: React.Dispatch<string | undefined>;
  id?: string;
};

function IconSelect({ value, onChange, id }: IconSelectProps): JSX.Element {
  // Adapted from https://github.com/JedWatson/react-select/issues/3128#issuecomment-812619125
  const loadOptions = (inputValue?: string | null): IconOption[] => {
    if (!inputValue) {
      return ICON_OPTIONS.slice(0, 50);
    }

    const matchByStart = [];
    const matchByInclusion = [];

    const regByInclusion = new RegExp(escapeRegExp(inputValue), 'i');
    const regByStart = new RegExp(`^${escapeRegExp(inputValue)}`, 'i');

    for (const option of ICON_OPTIONS) {
      if (regByInclusion.test(option.label)) {
        if (regByStart.test(option.label)) {
          matchByStart.push(option);
        } else {
          matchByInclusion.push(option);
        }
      }
    }

    return [...matchByStart, ...matchByInclusion].slice(0, 50);
  };

  const [filteredOptions, setFilteredOptions] = useState(() => loadOptions(''));
  const filterOptions = (input?: string | null) => {
    setFilteredOptions(loadOptions(input));
  };

  return (
    <Select
      id={id}
      isClearable
      isMulti={false}
      options={filteredOptions}
      value={{ label: value, value }}
      onInputChange={(input) => filterOptions(input)}
      filterOption={() => true}
      onChange={(newValue) => onChange(newValue?.value)}
      formatOptionLabel={(option) => (
        <>
          <i className={`bi-${option.value}`} /> {option.label}
        </>
      )}
    />
  );
}

export default IconSelect;
