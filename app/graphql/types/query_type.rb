module Types
  class QueryType < Types::BaseObject
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    field :project, Types::ProjectType, null: false do
      argument :id, ID, required: true
    end

    def project(id:)
      Project.find(id)
    end

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

    field :brand, Types::BrandType, null: false do
      argument :id, ID, required: true
    end

    def brand(id:)
      Brand.find(id)
    end

    field :brands, Types::BrandType.connection_type, null: false

    def brands
      Brand.
        select("brands.*, count(projects.id) as project_count").
        joins("left join projects on projects.brand_id = brands.id").
        group("projects.brand_id, brands.id").
        order("project_count desc").
        accessible_by(context[:current_ability])
    end

    field :tags, Types::TagType.connection_type, null: false do
      argument :query_string, String, required: false
    end

    def tags(query_string: nil)
      if query_string.present?
        SearchRequest.new(
          Tag,
          {
            query: {
              multi_match: {
                query: query_string,
                fields: [:name, :category_name],
                type: 'phrase_prefix'
              }
            }
          }
        )
      else
        Tag.order("upper(name)")
      end
    end

    field :tag_categories, Types::TagCategoryType.connection_type, null: false

    def tag_categories
      TagCategory.order(:name)
    end

    field :project_promotions, [Types::ProjectPromotionType], null: false

    def project_promotions
      ProjectPromotion.joins(:project).order('projects.title')
    end
  end
end
