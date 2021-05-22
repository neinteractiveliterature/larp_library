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
      argument :id, ID, required: false
      argument :slug, String, required: false
    end

    def brand(id: nil, slug: nil)
      if id
        Brand.find(id)
      elsif slug
        Brand.find_by!(slug: slug)
      else
        raise GraphQL::ExecutionError, 'Either id or slug must be specified to find a Brand'
      end
    end

    field :brands, Types::BrandType.connection_type, null: false do
      argument :unapproved, Boolean, required: false
    end

    def brands(unapproved: false)
      scope = Brand
        .select('brands.*, count(projects.id) as project_count')
        .joins('left join projects on projects.brand_id = brands.id')
        .group('projects.brand_id, brands.id')
        .order('project_count desc')
        .accessible_by(context[:current_ability])

      scope = scope.where(approved: false) if unapproved
      scope
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
        Tag.order('upper(name)')
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

    field :licenses, [Types::LicenseType], null: false

    def licenses
      Project::LICENSES.map { |id, attrs| attrs.merge(id: id) }
    end

    field :current_user, Types::UserType, null: true

    def current_user
      context[:current_user]
    end
  end
end
