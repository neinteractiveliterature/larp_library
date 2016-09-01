class HomeController < ApplicationController
  skip_authorization_check

  def index
    @project_promotions = ProjectPromotion.includes(:project => :brand).order("projects.title")
    @tags_by_category = Tag.includes(:tag_category, :projects).order(:name).group_by(&:tag_category)
  end
end
