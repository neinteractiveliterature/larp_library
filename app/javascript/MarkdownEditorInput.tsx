import { useState } from 'react';
import { CodeInput } from '@neinteractiveliterature/litform';
import ReactMarkdown from 'react-markdown';

export type MarkdownEditorInputProps = {
  initialValue: string;
  name: string;
  id: string;
};

function MarkdownEditorInput({ name, id, initialValue }: MarkdownEditorInputProps): JSX.Element {
  const [value, setValue] = useState(initialValue);

  return (
    <>
      <CodeInput
        mode="markdown"
        value={value}
        onChange={setValue}
        getPreviewContent={async (markdown) => <ReactMarkdown>{markdown}</ReactMarkdown>}
      />
      <input id={id} name={name} type="hidden" value={value ?? ''} />
    </>
  );
}

export default MarkdownEditorInput;
