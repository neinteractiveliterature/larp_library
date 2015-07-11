class BrandMembershipsController < ApplicationController
  load_resource :brand, find_by: :slug
  load_resource through: :brand, find_by: :invitation_token
  
  def pre_accept
    session[:user_return_to] = request.url
  end
  
  def accept
    redirect_to pre_accept_brand_membership_path(@brand, @brand_membership) unless user_signed_in?
    
    session[:user_return_to] = nil
    @brand_membership.update(user: current_user)
    redirect_to @brand, notice: "Thank you!  You can now manage content for #{@brand.name}."
  end
end
