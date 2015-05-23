class TagsController < ApplicationController
  respond_to :json
  
  def index
    @tags = if params[:q].present?
      Tag.search(query: {
        match_phrase_prefix: {
          name: params[:q]
        }
      }).records
    else
      Tag.none
    end
    
    respond_with @tags
  end
end
