module Types
  class BaseConnection < Types::BaseObject
    # add `nodes` and `pageInfo` fields, as well as `edge_type(...)` and `node_nullable(...)` overrides
    include GraphQL::Types::Relay::ConnectionBehaviors

    node_nullable false
    edge_nullable false
    edges_nullable false

    field :total_count, Integer, null: false

    def total_count
      case object
      when GraphQL::Pagination::ActiveRecordRelationConnection
        model = object.items.klass
        scoped_query = object.items.select(:id).to_sql
        model.where("id IN (SELECT #{model.connection.quote_table_name(model.table_name)}.id FROM (#{scoped_query}) scoped_query)").count
      when Connections::SearchRequestConnection
        object.total_count
      else
        object.nodes&.count
      end
    end
  end
end
