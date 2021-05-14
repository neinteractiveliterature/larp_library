module Types
  class QueryType < Types::BaseObject
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    field :projects, Types::ProjectType.connection_type, null: false do
      argument :query_string, String, required: false
      argument :tag, String, required: false
      argument :brand_id, Integer, required: false
    end

    def projects(query_string: nil, tag: nil, brand_id: nil)
      SearchRequest.new(
        Project,
        ProjectSearch.new(query_string: query_string, tag: tag, brand_id: brand_id).to_hash
      )
    end
  end
end
