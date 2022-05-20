# frozen_string_literal: true
class ProjectPromotion < ApplicationRecord
  belongs_to :project
  validates :project_id, uniqueness: { message: "is already being promoted." }
end
