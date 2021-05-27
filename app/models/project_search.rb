class ProjectSearch
  attr_reader :query_string, :tag, :brand_id, :search_after

  def initialize(query_string: nil, tag: nil, brand_id: nil)
    @query_string = query_string
    @tag = tag
    @brand_id = brand_id
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
    @must_queries ||= [brand_approved_query, query_string_query, tag_query, brand_query].compact
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
