# frozen_string_literal: true
FactoryBot.define do
  factory :project_link do
    project { nil }
    url { "MyText" }
    title { "MyText" }
    icon { "MyText" }
  end
end
