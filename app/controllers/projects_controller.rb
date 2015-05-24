class ProjectsController < ApplicationController
  load_and_authorize_resource
  
  respond_to :html
  
  def index
    must_queries = []
    if params[:q].present?
      must_queries << {
        multi_match: {
          query: params[:q],
          fields: ['title^3', 'authors^2', 'tag_names^2', 'description'],
          fuzziness: 'AUTO'
        }
      }
    elsif params[:tag].present?
      must_queries << {
        term: {
          tag_names: params[:tag]
        }
      }
    end
    
    query = if must_queries.any?
      {
        bool: {
          must: must_queries
        }
      }
    else
      {
        match_all: {}
      }
    end
    
    @projects = Project.search(query: query, sort: ["_score", "title"]).page(params[:page]).records
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
  
  def destroy
    @project.destroy
    respond_with @project
  end
  
  private
  def project_params
    params.require(:project).permit(
      :title, 
      :authors, 
      :description, 
      :license, 
      :publication_year,
      :min_players,
      :max_players,
      :length_quantity,
      :length_units,
      tag_names: [])
  end
end
