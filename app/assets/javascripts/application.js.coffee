#= require jquery
#= require jquery_ujs
#= require bootstrap-sprockets
#= require evaporatejs
#= require bootstrap-colorpicker
#= require ace/ace
#= require ace/worker-html
#= require ace/mode-markdown
#= require ace/theme-textmate
#= require selectize
#= require_tree .
#= require_self

$ ->
  $('.colorpicker').colorpicker
    format: 'hex'
    component: '.input-group-addon'
