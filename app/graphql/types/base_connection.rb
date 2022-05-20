# frozen_string_literal: true
module Types
  class BaseConnection < Types::BaseObject
    include GraphQL::Types::Relay::ConnectionBehaviors

    node_nullable false
    edge_nullable false
    edges_nullable false
    has_nodes_field false

    field :total_count, Integer, null: false

    def total_count
      case object
      when GraphQL::Pagination::ActiveRecordRelationConnection
        count_active_record_relation
      else
        object.nodes&.count
      end
    end

    private

    def count_active_record_relation
      model = object.items.klass
      scope = object.items

      scope_has_id = scope.select_values.any? do |select_value|
        select_value.split(",").map(&:strip).any? do |column_spec|
          ["#{model.table_name}.*", "#{model.table_name}.id"].include?(column_spec)
        end
      end
      scope = scope.select(:id) unless scope_has_id

      where_clause = <<~SQL.squish
        #{model.table_name}.id IN (SELECT scoped_query.id FROM (#{scope.to_sql}) scoped_query)
      SQL

      model.where(where_clause).count
    end
  end
end
