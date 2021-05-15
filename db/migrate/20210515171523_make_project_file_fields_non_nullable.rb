class MakeProjectFileFieldsNonNullable < ActiveRecord::Migration[6.1]
  def change
    %i[url filename filesize filepath].each do |column_name|
      change_column_null :project_files, column_name, false
    end
  end
end
