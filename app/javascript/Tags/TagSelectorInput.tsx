import { useState } from 'react';
import { TagFragment } from './queries.generated';
import TagSelector from './TagSelector';

export type TagSelectorInputProps = {
  initialValue: TagFragment[];
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
