class ProjectSearch
  attr_reader :query_string, :tag, :brand_id, :title, :authors,
    :player_count_upper_bound, :player_count_lower_bound,
    :facilitator_count_upper_bound, :facilitator_count_lower_bound

  def initialize(
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
    @query_string = query_string
    @tag = tag
    @brand_id = brand_id
    @title = title
    @authors = authors
    @player_count_upper_bound = player_count_upper_bound
    @player_count_lower_bound = player_count_lower_bound
    @facilitator_count_upper_bound = facilitator_count_upper_bound
    @facilitator_count_lower_bound = facilitator_count_lower_bound
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
      player_count_upper_bound_query,
      player_count_lower_bound_query,
      player_count_single_bound_query,
      facilitator_count_upper_bound_query,
      facilitator_count_lower_bound_query,
      facilitator_count_single_bound_query
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
        title: { query: title, fuzziness: 'AUTO' }
      }
    }
  end

  def authors_query
    return unless authors.present?

    {
      match: {
        authors: { query: authors, fuzziness: 'AUTO' }
      }
    }
  end

  def player_count_upper_bound_query
    return unless player_count_upper_bound.present?

    {
      range: { max_players: { gte: player_count_upper_bound } }
    }
  end

  def player_count_lower_bound_query
    return unless player_count_lower_bound.present?

    {
      range: { min_players: { lte: player_count_lower_bound } }
    }
  end

  def player_count_single_bound_query
    if player_count_lower_bound.present? && player_count_upper_bound.blank?
      { range: { max_players: { gte: player_count_lower_bound } } }
    elsif player_count_lower_bound.blank? && player_count_upper_bound.present?
      { range: { min_players: { lte: player_count_upper_bound } } }
    end
  end

  def facilitator_count_upper_bound_query
    return unless facilitator_count_upper_bound.present?

    {
      range: { max_facilitators: { gte: facilitator_count_upper_bound } }
    }
  end

  def facilitator_count_lower_bound_query
    return unless facilitator_count_lower_bound.present?

    {
      range: { min_facilitators: { lte: facilitator_count_lower_bound } }
    }
  end

  def facilitator_count_single_bound_query
    if facilitator_count_lower_bound.present? && facilitator_count_upper_bound.blank?
      { range: { max_facilitators: { gte: facilitator_count_lower_bound } } }
    elsif facilitator_count_lower_bound.blank? && facilitator_count_upper_bound.present?
      { range: { min_facilitators: { lte: facilitator_count_upper_bound } } }
    end
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
