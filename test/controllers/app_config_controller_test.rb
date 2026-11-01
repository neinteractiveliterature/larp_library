# frozen_string_literal: true
require "test_helper"

class AppConfigControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  test "it gives anonymous visitors the CSRF tokens and no user" do
    get "/app_config"

    assert_response :success
    assert_equal "no-store", response.headers["Cache-Control"]
    config = response.parsed_body
    assert config["graphqlCSRFToken"].present?
    assert config["signInCSRFToken"].present?
    assert config["signOutCSRFToken"].present?
    assert_nil config["currentUserId"]
    assert_equal ProjectFile.s3_bucket, config.dig("s3Configuration", "bucketName")
  end

  test "it identifies the signed-in user" do
    user = FactoryBot.create(:user)
    sign_in user

    get "/app_config"

    assert_equal user.id, response.parsed_body["currentUserId"]
  end
end
