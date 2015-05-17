#= require jquery
#= require jquery_ujs
#= require bootstrap-sprockets
#= require turbolinks
#= require s3_direct_upload
#= require_tree .
#= require_self

$ ->
  $("#s3-uploader").S3Uploader()