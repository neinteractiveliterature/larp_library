class SearchRequest
  attr_reader :model, :body

  def initialize(model, body)
    @model = model
    @body = body
  end

  def search(size: 10, search_after: nil)
    model.search(
      body.merge({ size: size, search_after: search_after }.compact)
    )
  end
end
