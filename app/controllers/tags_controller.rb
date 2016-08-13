class TagsController < ApplicationController
  respond_to :html, :json

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
      Tag.order("upper(name)")
    end

    respond_with @tags.as_json(methods: [:color, :text_color, :icon, :category_name])
  end
end
