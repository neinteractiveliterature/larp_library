class ProjectPromotionsController < ApplicationController
  load_and_authorize_resource
  respond_to :html
  responders :collection

  def index
  end

  def create
    @project_promotion.save
    respond_with @project_promotion
  end

  def destroy
    @project_promotion.destroy
    respond_with @project_promotion
  end

  private

  def project_promotion_params
    params.require(:project_promotion).permit(:project_id)
  end
end
