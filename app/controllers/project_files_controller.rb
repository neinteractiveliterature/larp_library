class ProjectFilesController < ApplicationController
  load_resource :brand, find_by: :slug
  load_resource :project, through: :brand
  load_and_authorize_resource through: :project

  respond_to :json

  def create
    @project_file.uploader = current_user
    @project_file.save

    respond_with @brand, @project, @project_file
  end

  def destroy
    @project_file.destroy
    redirect_back
  end

  def auth_upload
    digest = OpenSSL::Digest.new('sha1')
    hmac = OpenSSL::HMAC.digest(digest, ENV['AWS_SECRET_ACCESS_KEY'].encode('UTF-8'), request['to_sign'].encode('UTF-8'))
    hmac64 = Base64.encode64(hmac).chomp

    render plain: hmac64, status: 200
  end

  private
  def project_file_params
    params.require(:project_file).permit(:url, :filename, :filesize, :filetype, :filepath)
  end
end
