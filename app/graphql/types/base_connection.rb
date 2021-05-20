module Types
  class BaseConnection < Types::BaseObject
    # add `nodes` and `pageInfo` fields, as well as `edge_type(...)` and `node_nullable(...)` overrides
    include GraphQL::Types::Relay::ConnectionBehaviors

    node_nullable false
    edge_nullable false
    edges_nullable false
    has_nodes_field false

    field :total_count, Integer, null: false

    def total_count
      case object
      when GraphQL::Pagination::ActiveRecordRelationConnection
        model = object.items.klass
        scope = object.items
        scope_has_id = scope.select_values.any? do |select_value|
          select_value.split(',').map(&:strip).any? do |column_spec|
            ["#{model.table_name}.*", "#{model.table_name}.id"].include?(column_spec)
          end
        end
        scope = scope.select(:id) unless scope_has_id
        model.where("#{model.table_name}.id IN (SELECT scoped_query.id FROM (#{scope.to_sql}) scoped_query)").count
      when Connections::SearchRequestConnection
        object.total_count
      else
        object.nodes&.count
      end
    end
  end
end
