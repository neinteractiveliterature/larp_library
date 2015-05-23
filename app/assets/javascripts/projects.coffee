# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

# from https://gist.github.com/233053/f401f59c344ab2d42a341513c6caaa2bb3b2da2d
number_to_human_size = (size) ->
  if size < 1024
    size + ' bytes'
  else if (size < 1024.0 * 1024.0)
    (size / 1024.0).toFixed(2) + ' KiB'
  else if(size < 1024.0 * 1024.0 * 1024.0)
    (size / 1024.0 / 1024.0).toFixed(2) + ' MiB'
  else
    (size / 1024.0 / 1024.0 / 1024.0).toFixed(2) + ' GiB';

$ ->
  $('#s3-uploader').on 's3_upload_complete', (e, upload) ->
    $this = $(@)
    $fileList = $this.closest('.panel').find('.project-files')
    
    newFile = $("<li><a href=\"#{upload.url}\">#{upload.filename}</a> <small>(#{number_to_human_size upload.filesize})</small></li>")
    $fileList.append newFile
    
  $('.ace-editor').each ->
    editorDiv = $('<div class="form-control" style="height: 15em"></div>')
    $(this).hide().after(editorDiv)
    
    editor = ace.edit(editorDiv.get(0))
    editor.setTheme("ace/theme/textmate")
    editor.getSession().setMode("ace/mode/markdown")
    editor.getSession().setUseWrapMode(true)

    editor.getSession().setValue($(this).val())
    $(this).closest('form').on 'submit', =>
      $(this).val(editor.getSession().getValue())
      
  $('.tag-selector').selectize
    plugins: ['remove_button']
    valueField: 'name'
    labelField: 'name'
    searchField: 'name'
    create: true
    delimiter: ','
    persist: false
    create: (input) -> { name: input }
    load: (query, callback) ->
      $.ajax
        url: '/tags?q=' + encodeURIComponent(query)
        type: 'GET'
        dataType: 'json'
        error: -> callback()
        success: (res) -> callback(res)
