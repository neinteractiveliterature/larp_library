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

render_tag = (tag, escape) ->
  "<div class=\"label label-default\" style=\"background-color: #{tag.color}; color: #{tag.text_color}; font-size: 90%\">" +
  "<i class=\"fa fa-#{escape tag.icon}\" style=\"display: inline-block; vertical-align: middle; margin-right: 0.2em\" aria-hidden></i>" +
  escape(tag.name) +
  "</div>"

$ ->
  $(".s3-upload input[type=file]").on 'change', (e) ->
    $this = $(this)
    $form = $this.closest('.s3-upload')
    $fileList = $form.closest('.panel').find('.project-files')

    aws_key = $form.data('aws-access-key-id')
    signerUrl = $form.data('signer-url')
    serverNonce = $form.data('nonce')
    bucket = $form.data('bucket')
    completeCallbackUrl = $form.data('complete-callback-url')

    evaporate = new Evaporate
      aws_key: aws_key
      signerUrl: signerUrl
      bucket: bucket

    for file in e.target.files
      uniqueId = Math.random().toString(36).substr(2,16)
      objectName = "uploads/#{new Date().getTime()}-#{uniqueId}-#{serverNonce}/#{file.name}"

      progressContainer = $('<div style="margin-top: 10px; margin-bottom: 10px;">
        <div><small data-file-name></small></div>
        <div class="text-danger" data-error-area></div>
        <div class="progress">
          <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">
            <span class="sr-only">0% Complete</span>
          </div>
        </div>
      </div>')

      progressContainer.find('[data-file-name]').text(file.name)
      errorArea = progressContainer.find('[data-error-area]')
      progressBar = progressContainer.find('.progress-bar')

      setProgressFraction = (fraction) =>
        progressPercent = fraction * 100
        progressBar.attr('aria-valuenow', progressPercent)
        progressBar.find('.sr-only').text("#{progressPercent}% Complete")
        progressBar.css('width', "#{progressPercent}%")

      setError = (msg) =>
        errorArea.text(msg)
        setProgressFraction(1.0)
        progressBar.addClass('progress-bar-danger').removeClass('active progress-bar-striped')

      $form.append(progressContainer)

      fileId = evaporate.add
        name: objectName
        file: file
        contentType: file.type
        progress: setProgressFraction
        error: setError

        xAmzHeadersAtInitiate: { 'x-amz-acl': 'public-read' }

        complete: (xhr, awsObjectKey) =>
          $.ajax
            url: completeCallbackUrl
            type: 'POST'
            dataType: 'json'
            data:
              project_file:
                url: "https://#{bucket}.s3.amazonaws.com/#{awsObjectKey}"
                filename: file.name
                filetype: file.type
                filesize: file.size
                filepath: awsObjectKey

            error: (jqXHR, textStatus, errorThrown) =>
              setError(errorThrown)

            success: (upload) =>
              progressBar.addClass('progress-bar-success').removeClass('active progress-bar-striped')

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

  $('.tag-selector').each ->
    $this = $(this)
    $this.selectize
      plugins: ['remove_button']
      options: $this.data('options')
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
      render:
        item: render_tag
        option: (option, escape) ->
          category_name = if option.category_name then "(#{option.category_name})" else ""
          "<div>#{render_tag(option, escape)} #{category_name}</div>"
      score: (search) ->
        scoreFunction = this.getScoreFunction(search)
        (item) -> scoreFunction({name: "#{item.name} #{item.category_name}"})