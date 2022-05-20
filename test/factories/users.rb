# frozen_string_literal: true
FactoryBot.define do
  factory :user do
    sequence(:username) { |n| "somebody#{n}@example.com" }
  end
end
