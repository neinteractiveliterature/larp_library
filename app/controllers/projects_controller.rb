class ProjectsController < ApplicationController
  load_and_authorize_resource
  
  respond_to :html
  
  def index
  end
  
  def new
  end
  
  def create
    @project.save
    respond_with @project
  end
  
  def edit
  end
  
  def update
    @project.attributes = project_params
    @project.save
    respond_with @project
  end
  
  private
  def project_params
    params.require(:project).permit(:title, :authors, :description, tag_names: [])
  end
end
