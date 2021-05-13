// import $ from "jquery";
// @ts-expect-error no types for rails/ujs
import Rails from "@rails/ujs";
import "bootstrap-sass/assets/javascripts/bootstrap";
import "evaporate";
import React from "react";
import ReactDOM from "react-dom";

import "../projects";

Rails.start();

function LazyWrapper<P>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  const wrapper = (props: P) => (
    <React.Suspense fallback={<i className="fa fa-circle-notch fa-spin" />}>
      <Component {...props} />
    </React.Suspense>
  );
  wrapper.displayName = `LazyWrapper<${Component.displayName ?? "unknown"}>`;
  return wrapper;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const REACT_CLASSES: { [className: string]: React.ComponentType<any> } = {
  ColorPickerInput: LazyWrapper(
    React.lazy(() => import("../ColorPickerInput"))
  ),
  MarkdownEditorInput: LazyWrapper(
    React.lazy(() => import("../MarkdownEditorInput"))
  ),
  TagSelectorInput: LazyWrapper(
    React.lazy(() => import("../TagSelectorInput"))
  ),
};

window.addEventListener("load", () => {
  document.querySelectorAll("[data-react-class]").forEach((element) => {
    const className = element.getAttribute("data-react-class");
    const reactClass = REACT_CLASSES[className ?? ""];

    if (reactClass) {
      const props = JSON.parse(element.getAttribute("data-props") ?? "{}");
      ReactDOM.render(React.createElement(reactClass, props), element);
    }
  });
});
