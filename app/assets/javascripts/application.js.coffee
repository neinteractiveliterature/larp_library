#= require jquery
#= require jquery.turbolinks
#= require jquery_ujs
#= require bootstrap-sprockets
#= require turbolinks
#= require s3_direct_upload
#= require ace/ace
#= require ace/worker-html
#= require ace/mode-markdown
#= require ace/theme-textmate
#= require selectize
#= require_tree .
#= require_self

$ ->
  $("#s3-uploader").S3Uploader()