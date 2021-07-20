module Mutations
  class CompleteProjectFileUpload < BaseMutation
    argument :project_id, ID, required: true
    argument :url, String, required: true
    argument :filename, String, required: true
    argument :filesize, Int, required: true
    argument :filetype, String, required: false
    argument :filepath, String, required: true

    field :project_file, Types::ProjectFileType, null: false

    def authorized?(project_id:, url:, filename:, filesize:, filepath:, filetype: nil)
      @project = Project.find(project_id)
      @project_file = @project.project_files.new(
        url: url,
        filename: filename,
        filesize: filesize,
        filepath: filepath,
        filetype: filetype,
        uploader: context[:current_user]
      )
      context[:current_ability].authorize! :create, @project_file
      true
    end

    def resolve(**_args)
      @project_file.save!
      s3_object = Aws::S3::Object.new(ProjectFile.s3_bucket, @project_file.filepath)
      s3_object.put({ content_disposition: 'attachment' })

      { project_file: @project_file }
    end
  end
end
