class ProjectPromotion < ApplicationRecord
  belongs_to :project
  validates :project_id, uniqueness: { message: 'is already being promoted.' }
end
