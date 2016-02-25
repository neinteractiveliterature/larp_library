class HomeController < ApplicationController
  skip_authorization_check

  def index
    @project_promotions = ProjectPromotion.includes(:project => :brand).order("projects.title")
  end
end
