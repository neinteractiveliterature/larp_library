class TagCategoriesController < ApplicationController
  respond_to :html
  load_and_authorize_resource

  def index
    @tag_categories = @tag_categories.order(:name)
  end

  def new
  end

  def create
    @tag_category.save
    respond_with @tag_category, location: tag_categories_path
  end

  def edit
  end

  def update
    @tag_category.update(tag_category_params)
    respond_with @tag_category, location: tag_categories_path
  end

  def destroy
    @tag_category.destroy
    respond_with @tag_category
  end

  private

  def tag_category_params
    params.require(:tag_category).permit(:name, :color, :icon)
  end
end
