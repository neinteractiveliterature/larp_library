class Ability
  include CanCan::Ability

  def initialize(user)
    can :read, Project, { brand: { approved: true } }
    can :read, Brand, approved: true

    if user.try(:admin?)
      can :manage, :all
    elsif user
      project_conditions = { brand: { brand_memberships: { user: { id: user.id } } } }

      can :read, User, id: user.id
      can :manage, Project, project_conditions
      can :manage, ProjectFile, project: project_conditions
      can :read, Brand, brand_memberships: { user: { id: user.id } }
      can :read, BrandMembership, { brand: { brand_memberships: { user: { id: user.id } } } }
      can :manage, BrandMembership,
{ brand: { brand_memberships: { user: { id: user.id }, admin: true } } }
      can :create, Brand
      can [:update, :destroy], Brand, brand_memberships: { user: { id: user.id }, admin: true }
    end
  end
end
