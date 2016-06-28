class ProjectsController < ApplicationController
  load_resource :brand, find_by: :slug
  load_and_authorize_resource through: :brand

  respond_to :html

  def show
    if can? :edit, @project
      token_service = Fog::AWS::STS.new(aws_access_key_id: ENV['AWS_ACCESS_KEY_ID'], aws_secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'])
      token_response = token_service.get_session_token.data[:body]

      @temporary_session_token = token_response["SessionToken"]
    end
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
