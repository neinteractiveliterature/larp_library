class SearchProjectsController < ApplicationController
  def index
    search = ProjectSearch.new(query_string: params[:q], tag: params[:tag])
    @projects = Project.search(search).page(params[:page]).records
  end
end
