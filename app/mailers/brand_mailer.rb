class BrandMailer < ApplicationMailer
  def brand_pending(brand)
    @brand = brand

    to = User.where(admin: true).map { |user| "#{user.name} <#{user.email}>" }
    mail(to: to, subject: "New brand for approval on Larp Library: #{@brand.name}")
  end

  def brand_approved(brand)
    @brand = brand
    to = "#{brand.creator.name} <#{brand.creator.email}>"
    mail(to: to, subject: "#{@brand.name} is approved on Larp Library!")
  end
end
