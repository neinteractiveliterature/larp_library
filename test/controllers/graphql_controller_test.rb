# frozen_string_literal: true
require "test_helper"

class GraphqlControllerTest < ActionDispatch::IntegrationTest
  test "a missing record is reported with a NOT_FOUND code" do
    post "/graphql", params: { query: '{ brand(slug: "no-such-brand") { id } }' }, as: :json

    assert_response :success
    error = response.parsed_body["errors"].first
    assert_equal "Brand not found", error["message"]
    assert_equal "NOT_FOUND", error.dig("extensions", "code")
  end
end
