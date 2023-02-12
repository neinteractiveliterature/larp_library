# frozen_string_literal: true
module Types
  class QueryType < Types::BaseObject # rubocop:disable Metrics/ClassLength
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
      argument :title, String, required: false
      argument :authors, String, required: false
      argument :player_count_upper_bound, Int, required: false
      argument :player_count_lower_bound, Int, required: false
      argument :facilitator_count_upper_bound, Int, required: false
      argument :facilitator_count_lower_bound, Int, required: false
    end

    # rubocop:disable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity, Metrics/ParameterLists
    def projects(
      query_string: nil,
      tag: nil,
      brand_id: nil,
      title: nil,
      authors: nil,
      player_count_upper_bound: nil,
      player_count_lower_bound: nil,
      facilitator_count_upper_bound: nil,
      facilitator_count_lower_bound: nil
    )
      scope = Project.joins(:brand).where(brands: { approved: true })

      scope = scope.joins(:tags).where(tags: { name: tag }) if tag.present?
      scope = scope.where(brand_id: brand_id) if brand_id.present?
      scope = scope.search_title(title) if title.present?
      scope = scope.search_authors(authors) if authors.present?
      scope = scope.where("max_players >= ?", player_count_upper_bound) if player_count_upper_bound.present?
      scope = scope.where("min_players <= ?", player_count_lower_bound) if player_count_lower_bound.present?
      scope =
        scope.where("max_facilitators >= ?", facilitator_count_upper_bound) if facilitator_count_upper_bound.present?
      scope =
        scope.where("min_facilitators <= ?", facilitator_count_lower_bound) if facilitator_count_lower_bound.present?

      query_string.present? ? scope.search(query_string) : scope.order(:title_for_ordering)
    end
    # rubocop:enable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity, Metrics/ParameterLists

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
        raise GraphQL::ExecutionError, "Either id or slug must be specified to find a Brand"
      end
    end

    field :brands, Types::BrandType.connection_type, null: false do
      argument :unapproved, Boolean, required: false
    end

    field :brand_membership, Types::BrandMembershipType, null: false do
      argument :brand_id, ID, required: false
      argument :brand_slug, String, required: false
      argument :invitation_token, String, required: true
    end

    def brand_membership(brand_id: nil, brand_slug: nil, invitation_token: nil)
      invitation_brand = brand(id: brand_id, slug: brand_slug)

      context[:current_ability].user_provided_invitation_token(invitation_token)
      invitation_brand.brand_memberships.find_by!(invitation_token: invitation_token)
    end

    def brands(unapproved: false)
      scope =
        Brand
          .select("brands.*, count(projects.id) as project_count")
          .joins("left join projects on projects.brand_id = brands.id")
          .group("projects.brand_id, brands.id")
          .order("project_count desc")
          .accessible_by(context[:current_ability])

      scope = scope.where(approved: false) if unapproved
      scope
    end

    field :tags, Types::TagType.connection_type, null: false, max_page_size: 200 do
      argument :query_string, String, required: false
    end

    def tags(query_string: nil)
      scope = Tag.order("upper(tags.name)")

      if query_string.present?
        scope =
          scope.left_joins(:tag_category).where(
            "tags.name ILIKE ? OR tag_categories.name ILIKE ?",
            "#{query_string}%",
            "#{query_string}%"
          )
      end

      scope
    end

    field :tag, Types::TagType, null: false do
      argument :id, ID, required: true
    end

    def tag(id:)
      Tag.find(id)
    end

    field :tag_by_name, Types::TagType, null: true do
      argument :name, String, required: false
    end

    def tag_by_name(name: nil)
      return nil unless name

      Tag.find_by(name: name)
    end

    field :tag_categories, Types::TagCategoryType.connection_type, null: false do
      argument :query_string, String, required: false
    end

    def tag_categories(query_string: nil)
      scope = TagCategory.order("upper(name)")
      scope = scope.where("upper(name) like ?", "#{query_string.upcase}%") if query_string.present?
      scope
    end

    field :tag_category, Types::TagCategoryType, null: false do
      argument :id, ID, required: true
    end

    def tag_category(id:)
      TagCategory.find(id)
    end

    field :project_promotions, [Types::ProjectPromotionType], null: false

    def project_promotions
      ProjectPromotion.joins(:project).order("projects.title")
    end

    field :licenses, [Types::LicenseType], null: false

    def licenses
      Project::LICENSES.map { |id, attrs| attrs.merge(id: id) }
    end

    field :current_user, Types::UserType, null: true

    def current_user
      context[:current_user]
    end

    field :current_ability, Types::AbilityType, null: false

    def current_ability
      context[:current_ability]
    end

    field :presign_s3_url, String, null: false do
      argument :http_method, String, required: true
      argument :url, String, required: true
      argument :headers, GraphQL::Types::JSON, required: true
    end

    def presign_s3_url(http_method:, url:, headers:)
      raise GraphQL::ExecutionError, "Must be signed in" unless current_user

      unless %w[PUT POST].include?(http_method.upcase)
        raise GraphQL::ExecutionError, "Only PUT and POST requests can be pre-signed"
      end

      uri = URI.parse(url)
      unless uri.hostname == "#{ProjectFile.s3_bucket}.s3.#{ENV.fetch("AWS_REGION")}.amazonaws.com"
        raise GraphQL::ExecutionError, "Unexpected hostname"
      end
      filepath = uri.path.gsub(%r{\A/*}, "")
      raise GraphQL::ExecutionError, "Cannot overwrite existing object" if ProjectFile.where(filepath: filepath).any?

      signer =
        Aws::Sigv4::Signer.new(
          service: "s3",
          region: ENV.fetch("AWS_REGION"),
          access_key_id: ENV.fetch("AWS_ACCESS_KEY_ID"),
          secret_access_key: ENV.fetch("AWS_SECRET_ACCESS_KEY")
        )
      signer.presign_url(http_method: http_method, url: url, headers: headers)
    end
  end
end
