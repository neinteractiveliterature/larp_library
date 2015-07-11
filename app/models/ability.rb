class Ability
  include CanCan::Ability

  def initialize(user)
    can :read, Project
    can :read, Brand, approved: true
    
    if user.try(:admin?)
      can :manage, :all
    elsif user
      project_conditions = { brand: { brand_memberships: { user: { id: user.id } } } }
      
      can :manage, Project, project_conditions
      can :manage, ProjectFile, project: project_conditions
      can :read, Brand, brand_memberships: { user: { id: user.id } }
      can :create, Brand
      can [:update, :destroy], Brand, brand_memberships: { user: { id: user.id }, admin: true }
    end
  end
end
