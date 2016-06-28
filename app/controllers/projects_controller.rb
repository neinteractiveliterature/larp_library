class ProjectsController < ApplicationController
  load_resource :brand, find_by: :slug
  load_and_authorize_resource through: :brand

  respond_to :html

  def show
  end

  def new
  end

  def create
    @project.save
    respond_with @brand, @project
  end

  def edit
  end

  def update
    @project.attributes = project_params
    @project.save
    respond_with @brand, @project
  end

  def destroy
    @project.destroy
    respond_with @brand, @project
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
