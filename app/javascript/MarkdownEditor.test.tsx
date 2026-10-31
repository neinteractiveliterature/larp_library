import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditorView } from '@codemirror/view';

import MarkdownEditor from './MarkdownEditor';

function getEditorView(container: HTMLElement) {
  const view = EditorView.findFromDOM(container.querySelector('.cm-editor') as HTMLElement);
  if (!view) {
    throw new Error('Could not find the CodeMirror editor');
  }
  return view;
}

describe('MarkdownEditor', () => {
  it('shows the current value in the editor', async () => {
    const { container } = render(<MarkdownEditor value={'# Hello\n\nSome *emphasis*'} onChange={() => {}} />);

    await vi.waitFor(() => expect(container.querySelector('.cm-content')).toHaveTextContent('# Hello'));
    expect(container.querySelector('.cm-content')).toHaveTextContent('Some *emphasis*');
  });

  it('reports edits made in the editor', async () => {
    const onChange = vi.fn();
    const { container } = render(<MarkdownEditor value="Hello" onChange={onChange} />);

    await vi.waitFor(() => expect(container.querySelector('.cm-editor')).toBeInTheDocument());
    const view = getEditorView(container);
    view.dispatch({ changes: { from: view.state.doc.length, insert: ', world' } });

    expect(onChange).toHaveBeenLastCalledWith('Hello, world');
  });

  it('renders a markdown preview', async () => {
    const user = userEvent.setup();
    const { container } = render(<MarkdownEditor value="Some **bold** text" onChange={() => {}} />);
    await vi.waitFor(() => expect(container.querySelector('.cm-editor')).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: 'Preview' }));

    expect((await screen.findByText('bold')).tagName).toEqual('STRONG');
  });
});
