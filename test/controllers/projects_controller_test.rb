require 'test_helper'

class ProjectsControllerTest < ActionController::TestCase
  test 'updating tags also updates the elasticsearch document' do
    user = create(:user)
    project = create(:project, tag_names: ['a', 'b'])
    user.brands << project.brand
    sign_in user

    put :update, id: project.id, brand_id: project.brand.slug, project: { tag_names: ['a', 'b', 'c'] }

    assert_equal ['a', 'b', 'c'], elasticsearch_source(project)['tag_names'].sort
  end
end
