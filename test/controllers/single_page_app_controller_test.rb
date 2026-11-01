# frozen_string_literal: true
require "test_helper"

class SinglePageAppControllerTest < ActionDispatch::IntegrationTest
  setup do
    @shell = SinglePageAppController::SHELL_PATH
    @shell_existed = @shell.exist?
    unless @shell_existed
      FileUtils.mkdir_p(@shell.dirname)
      File.write(@shell, "<!DOCTYPE html><html><body>app shell</body></html>")
    end
  end

  teardown { FileUtils.rm_f(@shell) unless @shell_existed }

  test "it serves the same static shell for any page URL" do
    %w[/ /projects /brands/acme/projects/7-the-big-larp/edit].each do |path|
      get path

      assert_response :success
      assert_equal "text/html", response.media_type
      assert_equal "no-cache", response.headers["Cache-Control"]
      assert_includes response.body, "<html"
    end
  end
end
