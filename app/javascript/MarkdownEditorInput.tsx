import { useState } from "react";
import MarkdownEditor from "./MarkdownEditor";

export type MarkdownEditorInputProps = {
  initialValue: string;
  name: string;
  id: string;
};

function MarkdownEditorInput({
  name,
  id,
  initialValue,
}: MarkdownEditorInputProps): JSX.Element {
  const [value, setValue] = useState(initialValue);

  return (
    <>
      <MarkdownEditor value={value} onChange={setValue} />
      <input id={id} name={name} type="hidden" value={value} />
    </>
  );
}

export default MarkdownEditorInput;
