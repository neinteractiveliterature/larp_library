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
    redirect_to :back
  end
  
  private
  def project_file_params
    params.permit(:url, :filename, :filesize, :filetype, :filepath)
  end
end
