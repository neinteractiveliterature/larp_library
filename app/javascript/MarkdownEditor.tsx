import { CodeInput, useStandardCodeMirror } from '@neinteractiveliterature/litform';
import { CodeInputProps } from '@neinteractiveliterature/litform/lib/CodeInput';
import ReactMarkdown from 'react-markdown';
import { markdown } from '@codemirror/lang-markdown';
import { useMemo } from 'react';

export default function MarkdownEditor(
  props: { value: string; onChange: React.Dispatch<string> } & Omit<
    CodeInputProps,
    'editorRef' | 'getPreviewContent'
  >,
): JSX.Element {
  const extensions = useMemo(() => [markdown()], []);
  const [editorRef] = useStandardCodeMirror({
    extensions,
    value: props.value,
    onChange: props.onChange,
  });

  return (
    <CodeInput
      {...props}
      editorRef={editorRef}
      getPreviewContent={async (markdown) => <ReactMarkdown>{markdown}</ReactMarkdown>}
    />
  );
}
