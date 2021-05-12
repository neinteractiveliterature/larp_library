import $ from "jquery";
import Evaporate from "evaporate";
import ace from "ace-builds/src-noconflict/ace";
import MarkdownMode from "ace-builds/src-noconflict/mode-markdown";
import TextmateTheme from "ace-builds/src-noconflict/theme-textmate";

// from https://gist.github.com/233053/f401f59c344ab2d42a341513c6caaa2bb3b2da2d
function numberToHumanSize(size) {
  if (size < 1024) {
    return size + " bytes";
  } else if (size < 1024.0 * 1024.0) {
    return (size / 1024.0).toFixed(2) + " KiB";
  } else if (size < 1024.0 * 1024.0 * 1024.0) {
    return (size / 1024.0 / 1024.0).toFixed(2) + " MiB";
  } else {
    return (size / 1024.0 / 1024.0 / 1024.0).toFixed(2) + " GiB";
  }
}

function renderTag(tag, escape) {
  return (
    `<div class="label label-default" style="background-color: ${tag.color}; color: ${tag.text_color}; font-size: 90%">` +
    `<i class="fa fa-${escape(
      tag.icon
    )}" style="display: inline-block; vertical-align: middle; margin-right: 0.2em" aria-hidden></i>` +
    escape(tag.name) +
    "</div>"
  );
}

$(function () {
  $(".s3-upload input[type=file]").on("change", function (e) {
    const $this = $(this);
    const $form = $this.closest(".s3-upload");
    const $fileList = $form.closest(".panel").find(".project-files");
    const aws_key = $form.data("aws-access-key-id");
    const signerUrl = $form.data("signer-url");
    const serverNonce = $form.data("nonce");
    const bucket = $form.data("bucket");
    const completeCallbackUrl = $form.data("complete-callback-url");
    Evaporate.create({
      aws_key: aws_key,
      signerUrl: signerUrl,
      bucket: bucket,
      awsSignatureVersion: "2",
    }).then((evaporate) => {
      const ref = e.target.files;
      const results = [];
      for (let i = 0, len = ref.length; i < len; i++) {
        const file = ref[i];
        const uniqueId = Math.random().toString(36).substr(2, 16);
        const objectName = `uploads/${new Date().getTime()}-${uniqueId}-${serverNonce}/${
          file.name
        }`;
        const progressContainer = $(
          '<div style="margin-top: 10px; margin-bottom: 10px;"> <div><small data-file-name></small></div> <div class="text-danger" data-error-area></div> <div class="progress"> <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"> <span class="sr-only">0% Complete</span> </div> </div> </div>'
        );
        progressContainer.find("[data-file-name]").text(file.name);
        const errorArea = progressContainer.find("[data-error-area]");
        const progressBar = progressContainer.find(".progress-bar");
        const setProgressFraction = (fraction) => {
          var progressPercent;
          progressPercent = fraction * 100;
          progressBar.attr("aria-valuenow", progressPercent);
          progressBar.find(".sr-only").text(`${progressPercent}% Complete`);
          return progressBar.css("width", `${progressPercent}%`);
        };
        const setError = (msg) => {
          errorArea.text(msg);
          setProgressFraction(1.0);
          return progressBar
            .addClass("progress-bar-danger")
            .removeClass("active progress-bar-striped");
        };
        $form.append(progressContainer);

        results.push(
          evaporate.add({
            name: objectName,
            file: file,
            contentType: file.type,
            progress: setProgressFraction,
            error: setError,
            xAmzHeadersAtInitiate: {
              "x-amz-acl": "public-read",
            },
            complete: (xhr, awsObjectKey) => {
              return $.ajax({
                url: completeCallbackUrl,
                type: "POST",
                dataType: "json",
                data: {
                  project_file: {
                    url: `https://${bucket}.s3.amazonaws.com/${awsObjectKey}`,
                    filename: file.name,
                    filetype: file.type,
                    filesize: file.size,
                    filepath: awsObjectKey,
                  },
                },
                error: (jqXHR, textStatus, errorThrown) => {
                  return setError(errorThrown);
                },
                success: (upload) => {
                  var newFile;
                  progressBar
                    .addClass("progress-bar-success")
                    .removeClass("active progress-bar-striped");
                  newFile = $(
                    `<li><a href="${upload.url}">${
                      upload.filename
                    }</a> <small>(${numberToHumanSize(
                      upload.filesize
                    )})</small></li>`
                  );
                  return $fileList.append(newFile);
                },
              });
            },
          })
        );
      }
    });
  });

  $(".ace-editor").each(function () {
    const $this = $(this);
    const editorDiv = $(
      '<div class="form-control" style="height: 15em"></div>'
    );
    $this.hide().after(editorDiv);

    const editor = ace.edit(editorDiv.get(0));
    editor.setTheme(TextmateTheme);
    editor.getSession().setMode(MarkdownMode);
    editor.getSession().setUseWrapMode(true);
    editor.getSession().setValue($this.val());

    return $this.closest("form").on("submit", () => {
      return $this.val(editor.getSession().getValue());
    });
  });

  return $(".tag-selector").each(function () {
    var $this;
    $this = $(this);
    return $this.selectize({
      plugins: ["remove_button"],
      options: $this.data("options"),
      valueField: "name",
      labelField: "name",
      searchField: "name",
      delimiter: ",",
      persist: false,
      create: function (input) {
        return {
          name: input,
        };
      },
      load: function (query, callback) {
        return $.ajax({
          url: "/tags?q=" + encodeURIComponent(query),
          type: "GET",
          dataType: "json",
          error: function () {
            return callback();
          },
          success: function (res) {
            return callback(res);
          },
        });
      },
      render: {
        item: renderTag,
        option: function (option, escape) {
          var category_name;
          category_name = option.category_name
            ? `(${option.category_name})`
            : "";
          return `<div>${renderTag(option, escape)} ${category_name}</div>`;
        },
      },
      score: function (search) {
        var scoreFunction;
        scoreFunction = this.getScoreFunction(search);
        return function (item) {
          return scoreFunction({
            name: `${item.name} ${item.category_name}`,
          });
        };
      },
    });
  });
});
