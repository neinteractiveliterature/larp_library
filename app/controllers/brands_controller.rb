class BrandsController < ApplicationController
  load_and_authorize_resource find_by: :slug
  respond_to :html

  def new
  end

  def create
    @brand.creator = current_user

    if @brand.save
      @brand.brand_memberships.create user: current_user, admin: true
      BrandMailer.brand_pending(@brand).deliver_later
    end

    respond_with @brand
  end

  def unapproved
    @brands = @brands.where(approved: false)
  end

  def approve
    @brand.update(approved: true)
    BrandMailer.brand_approved(@brand).deliver_later
    redirect_to unapproved_brands_path
  end

  private

  def brand_params
    permitted_attrs = [:name, :description]

    if @brand.try(:approved?)
      permitted_attrs << { brand_memberships_attributes: [:id, :email, :inviting_user_id, :admin,
                                                          :_destroy] }
    end

    params.require(:brand).permit(permitted_attrs)
  end
end
