# frozen_string_literal: true
FactoryBot.define do
  factory :project do
    sequence(:title) { |n| "Project #{n}" }
    license { "cc40_by" }
    brand
  end
end
