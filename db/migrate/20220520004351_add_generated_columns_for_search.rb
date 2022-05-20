# frozen_string_literal: true
class AddGeneratedColumnsForSearch < ActiveRecord::Migration[6.1]
  def up
    execute "CREATE EXTENSION IF NOT EXISTS unaccent"

    # https://stackoverflow.com/questions/11005036/does-postgresql-support-accent-insensitive-collations/11007216#11007216
    execute <<~SQL.squish
    CREATE OR REPLACE FUNCTION public.f_unaccent(text)
      RETURNS text AS
    $func$
    SELECT public.unaccent('public.unaccent', $1)  -- schema-qualify function and dictionary
    $func$  LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT;
    SQL

    execute <<~SQL.squish
      ALTER TABLE projects
      ADD COLUMN title_for_ordering text GENERATED ALWAYS AS (lower(regexp_replace(regexp_replace(regexp_replace(title, '^the\\s+', '', 'i'), '^an?\\s+', '', 'i'), '[^A-Za-z0-9]', '', 'g'))) STORED,
      ADD COLUMN title_vector tsvector GENERATED ALWAYS AS (to_tsvector('english', f_unaccent(regexp_replace(regexp_replace(title, '^the\\s+', '', 'i'), '^an?\\s+', '', 'i')))) STORED,
      ADD COLUMN authors_vector tsvector GENERATED ALWAYS AS (to_tsvector('english', f_unaccent(authors))) STORED,
      ADD COLUMN description_vector tsvector GENERATED ALWAYS AS (to_tsvector('english', f_unaccent(description))) STORED
    SQL

    execute <<~SQL.squish
      ALTER TABLE brands
      ADD COLUMN name_vector tsvector GENERATED ALWAYS AS (to_tsvector('english', f_unaccent(name))) STORED
    SQL

    execute <<~SQL.squish
      ALTER TABLE pg_search_documents
      ADD COLUMN content_vector tsvector GENERATED ALWAYS AS (to_tsvector('english', f_unaccent(content))) STORED
    SQL

    execute "CREATE INDEX idx_projects_title_vector ON projects USING GIN(title_vector)"
    execute "CREATE INDEX idx_projects_authors_vector ON projects USING GIN(authors_vector)"
    execute "CREATE INDEX idx_projects_description_vector ON projects USING GIN(description_vector)"
    execute "CREATE INDEX idx_brands_name_vector ON brands USING GIN(name_vector)"
    execute "CREATE INDEX idx_pg_search_documents_content_vector ON pg_search_documents USING GIN(content_vector)"
  end

  def down
    execute <<~SQL.squish
      ALTER TABLE projects
      DROP COLUMN title_vector,
      DROP COLUMN authors_vector,
      DROP COLUMN description_vector,
      DROP COLUMN title_for_ordering
    SQL

    execute "ALTER TABLE brands DROP COLUMN name_vector"
    execute "ALTER TABLE pg_search_documents DROP COLUMN content_vector"
  end
end
