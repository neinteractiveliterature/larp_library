import { useState } from 'react';
import { TagAttributes } from './Tag';
import TagSelector from './TagSelector';

export type TagSelectorInputProps = {
  initialValue: TagAttributes[];
  name: string;
};

function TagSelectorInput({ name, initialValue }: TagSelectorInputProps): JSX.Element {
  const [value, setValue] = useState(initialValue);

  return (
    <>
      {value.map((tag) => (
        <input name={name} type="hidden" key={tag.name} value={tag.name} />
      ))}
      <TagSelector value={value} onChange={setValue} />
    </>
  );
}

export default TagSelectorInput;
