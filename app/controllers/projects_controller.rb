class ProjectsController < ApplicationController
  load_and_authorize_resource
  
  respond_to :html
  
  def index
    @projects = if params[:q].present?
      Project.search(
      query: {
        multi_match: {
          query: params[:q],
          fields: ['title^3', 'authors^2', 'tag_names^2', 'description'],
          fuzziness: 'AUTO'
        }
      }
      ).records.page(params[:page])
    else
      Project.order(:title).page(params[:page])
    end
    
    @projects = @projects.includes(:project_files, :tags)
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
    params.require(:project).permit(:title, :authors, :description, :license, tag_names: [])
  end
end
