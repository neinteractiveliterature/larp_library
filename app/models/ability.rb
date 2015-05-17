class Ability
  include CanCan::Ability

  def initialize(user)
    can :read, Project    
    
    if user.try(:admin?)
      can :manage, :all
    end
  end
end
