import $ from "jquery";
import Rails from "@rails/ujs";
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

Rails.start();
