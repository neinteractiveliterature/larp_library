class AddPositionToProjectFiles < ActiveRecord::Migration[6.1]
  def change
    add_column :project_files, :position, :integer

    reversible do |dir|
      dir.up do
        execute <<~SQL
          UPDATE project_files
          SET position = subquery.position
          FROM (
            SELECT id, row_number() over (partition by project_id order by lower(filename)) as position
            FROM project_files
          ) AS subquery
          WHERE project_files.id = subquery.id
        SQL
      end
    end
  end
end
