class ProjectFile < ActiveRecord::Base
  belongs_to :project
  belongs_to :uploader, class_name: "User"
end
