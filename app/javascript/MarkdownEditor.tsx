import { useCallback, ReactNode } from "react";
import * as React from "react";
import {
  Controlled as CodeMirror,
  IControlledCodeMirror,
  DomEvent,
} from "react-codemirror2";
import classNames from "classnames";

import { EditorConfiguration } from "codemirror";
import "codemirror/mode/markdown/markdown";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/mode/multiplex";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/edit/matchtags";
import "codemirror/addon/fold/foldcode";
import "codemirror/addon/fold/brace-fold";
import "codemirror/addon/fold/markdown-fold";
import "codemirror/addon/fold/xml-fold";
import "codemirror/addon/fold/foldgutter";
import "codemirror/addon/fold/foldgutter.css";

const defaultCodeMirrorOptions: EditorConfiguration = {
  lineNumbers: true,
  foldGutter: true,
  lineWrapping: true,
  matchBrackets: true,
  tabSize: 2,
  indentWithTabs: false,
  gutters: ["CodeMirror-foldgutter", "CodeMirror-linenumbers"],
  extraKeys: {
    Tab: (cm) => {
      // always use spaces, not tabs
      const spaces = Array((cm.getOption("indentUnit") ?? 2) + 1).join(" ");
      cm.replaceSelection(spaces);
    },
  },
};

export type MarkdownInputProps = Omit<
  IControlledCodeMirror,
  "onChange" | "onBeforeChange"
> & {
  onChange: (value: string) => void;
  disabled?: boolean;
  codeMirrorOptions?: EditorConfiguration;
  lines?: number;
  formControlClassName?: string;
  editorWrapperClassName?: string;
  children?: ReactNode;
};

function MarkdownInput({
  onBlur,
  onChange,
  value,
  disabled,
  codeMirrorOptions,
  className,
  lines,
  formControlClassName,
  editorWrapperClassName,
  children,
  ...props
}: MarkdownInputProps): JSX.Element {
  const onBeforeChange = useCallback(
    (editor, data, newValue) => {
      onChange(newValue);
    },
    [onChange]
  );

  const renderContent = () => {
    // react-codemirror2 doesn't want event handlers to be passed undefined
    const eventHandlers: { onBlur?: DomEvent } = {};
    if (onBlur) {
      eventHandlers.onBlur = onBlur;
    }

    return (
      <CodeMirror
        value={value}
        options={{
          ...defaultCodeMirrorOptions,
          lineNumbers: false,
          foldGutter: false,
          gutters: [],
          mode: "markdown",
          readOnly: disabled ? "nocursor" : false,
          ...(codeMirrorOptions || {}),
        }}
        {...eventHandlers}
        onBeforeChange={onBeforeChange}
        {...props}
      />
    );
  };

  return (
    <div className={className}>
      <div
        className={classNames(
          `form-control p-0 intercode-code-input codemirror-height-${
            lines || 10
          }`,
          formControlClassName
        )}
        style={{ overflow: "hidden" }}
      >
        <div
          className={classNames("form-control", editorWrapperClassName, {
            "bg-disabled": disabled,
          })}
          style={{ border: 0, boxShadow: "none", padding: 0 }}
        >
          {renderContent()}
        </div>
      </div>
      {children}
    </div>
  );
}

export default MarkdownInput;
