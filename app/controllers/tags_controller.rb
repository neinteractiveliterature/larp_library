class TagsController < ApplicationController
  respond_to :html, :json
  load_and_authorize_resource except: [:index]

  def index
    @tags = if params[:q].present?
      Tag.search(query: {
        multi_match: {
          query: params[:q],
          fields: [:name, :category_name],
          type: 'phrase_prefix'
        }
      }).records
    else
      Tag.order('upper(name)')
    end

    respond_with @tags.as_json(methods: [:color, :text_color, :icon, :category_name])
  end

  def new
  end

  def create
    @tag.save
    respond_with @tag, location: tags_path
  end

  def edit
  end

  def update
    @tag.update(tag_params)
    respond_with @tag, location: tags_path
  end

  def destroy
    @tag.destroy
    respond_with @tag
  end

  private

  def tag_params
    params.require(:tag).permit(:name, :tag_category_id)
  end
end
