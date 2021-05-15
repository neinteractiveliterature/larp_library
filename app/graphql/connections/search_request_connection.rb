class Connections::SearchRequestConnection < GraphQL::Pagination::Connection
  def nodes
    records
  end

  def has_next_page
    true
  end

  def has_previous_page
    after.present?
  end

  def cursor_for(item)
    idx = records.find_index(item)
    encode(response.results[idx]['sort'].to_json)
  end

  def total_count
    response.results.total
  end

  private

  def response
    @response ||= begin
      search_after = JSON.parse(decode(after)) if after.present?
      items.search(search_after: search_after, size: first)
    end
  end

  def records
    @records ||= response.records.to_a
  end
end
