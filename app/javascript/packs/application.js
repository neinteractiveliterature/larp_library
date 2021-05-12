import $ from "jquery";
import "rails-ujs";
import "bootstrap-sass/assets/javascripts/bootstrap";
import "selectize";
import "bootstrap-colorpicker";
import "evaporate";

import "../projects";

$(() => {
  $(".colorpicker").colorpicker({
    format: "hex",
    component: ".input-group-addon",
  });
});
