import $ from "jquery";
import Evaporate from "evaporate";

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
});
