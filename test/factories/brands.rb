FactoryBot.define do
  factory :brand do
    sequence(:name) { |n| "Brand #{n}" }
    association(:creator, factory: :user)
  end
end
