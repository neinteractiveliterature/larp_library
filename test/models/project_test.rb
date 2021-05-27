require 'test_helper'

class ProjectTest < ActiveSupport::TestCase
  test 'updating tags also updates the elasticsearch document' do
    project = create(:project, tag_names: %w[a b])
    assert_equal %w[a b], elasticsearch_source(project)['tag_names'].sort

    project.update!(tag_names: %w[a b c])
    assert_equal %w[a b c], elasticsearch_source(project)['tag_names'].sort
  end
end
