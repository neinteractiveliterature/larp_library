import $ from "jquery";
// @ts-expect-error @rails/ujs has no types available
import Rails from "@rails/ujs";
import "bootstrap-sass/assets/javascripts/bootstrap";
import "bootstrap-colorpicker";
import "evaporate";
import React from "react";
import ReactDOM from "react-dom";

import "../projects";
import TagSelectorInput from "../TagSelectorInput";

$(() => {
  // @ts-expect-error colorpickerrrrr
  $(".colorpicker").colorpicker({
    format: "hex",
    component: ".input-group-addon",
  });
});

Rails.start();

const REACT_CLASSES: { [className: string]: React.ComponentType<never> } = {
  TagSelectorInput,
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
