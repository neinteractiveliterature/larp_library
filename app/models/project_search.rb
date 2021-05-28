class ProjectSearch
  attr_reader :query_string, :tag, :brand_id, :title, :authors, :supports_at_least_players, :supports_at_most_players, :search_after

  def initialize(
    query_string: nil,
    tag: nil,
    brand_id: nil,
    title: nil,
    authors: nil,
    supports_at_least_players: nil,
    supports_at_most_players: nil
  )
    @query_string = query_string
    @tag = tag
    @brand_id = brand_id
    @title = title
    @authors = authors
    @supports_at_least_players = supports_at_least_players
    @supports_at_most_players = supports_at_most_players
  end

  def to_hash
    {
      query: query,
      sort: query_string.present? ? ['_score', 'title.raw'] : ['title.raw']
    }
  end

  def query
    @query ||= if must_queries.any?
      {
        bool: {
          must: must_queries
        }
      }
    else
      {
        match_all: {}
      }
    end
  end

  private

  def must_queries
    @must_queries ||= [
      brand_approved_query,
      query_string_query,
      tag_query,
      brand_query,
      title_query,
      authors_query,
      supports_at_least_players_query,
      supports_at_most_players_query
    ].compact
  end

  def query_string_query
    return unless query_string.present?

    {
      multi_match: {
        query: query_string,
        fields: ['title^3', 'authors^2', 'brand_name^2', 'tag_names^2', 'description'],
        fuzziness: 'AUTO'
      }
    }
  end

  def title_query
    return unless title.present?

    {
      match: {
        title: title
      }
    }
  end

  def authors_query
    return unless authors.present?

    {
      match: {
        authors: authors
      }
    }
  end

  def supports_at_least_players_query
    return unless supports_at_least_players.present?

    {
      range: { max_players: { gte: supports_at_least_players } }
    }
  end

  def supports_at_most_players_query
    return unless supports_at_most_players.present?

    {
      range: { min_players: { lte: supports_at_most_players } }
    }
  end

  def tag_query
    return unless tag.present?

    {
      term: {
        tag_names: tag.downcase
      }
    }
  end

  def brand_query
    return unless brand_id.present?

    {
      term: {
        brand_id: brand_id
      }
    }
  end

  def brand_approved_query
    {
      term: {
        brand_approved: true
      }
    }
  end
end
