# frozen_string_literal: true
class UpdateUnaccentFunction < ActiveRecord::Migration[7.2]
  def up
    # add the ::regdictionary cast which will hopefully make postgres 17 happy
    execute <<~SQL.squish
    CREATE OR REPLACE FUNCTION public.f_unaccent(text)
      RETURNS text AS
    $func$
    SELECT public.unaccent('public.unaccent'::regdictionary, $1)  -- schema-qualify function and dictionary
    $func$  LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT;
    SQL
  end

  def down
    execute <<~SQL.squish
    CREATE OR REPLACE FUNCTION public.f_unaccent(text)
      RETURNS text AS
    $func$
    SELECT public.unaccent('public.unaccent', $1)  -- schema-qualify function and dictionary
    $func$  LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT;
    SQL
  end
end
