class TagsController < ApplicationController
  respond_to :json
  
  def index
    @tags = if params[:q]
      Tag.where("name like ?", "#{params[:q]}%")
    else
      Tag.none
    end
    
    respond_with @tags
  end
end
