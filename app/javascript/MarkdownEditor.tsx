import { CodeInput } from '@neinteractiveliterature/litform/lib';
import { CodeInputProps } from '@neinteractiveliterature/litform/lib/CodeInput';
import ReactMarkdown from 'react-markdown';

export default function MarkdownEditor(
  props: Omit<CodeInputProps, 'mode' | 'getPreviewContent'>,
): JSX.Element {
  return (
    <CodeInput
      {...props}
      mode="markdown"
      getPreviewContent={async (markdown) => <ReactMarkdown>{markdown}</ReactMarkdown>}
    />
  );
}
