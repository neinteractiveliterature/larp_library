module ApplicationHelper
  def markdown(content)
    @markdown_renderer ||= Redcarpet::Markdown.new(Redcarpet::Render::HTML, autolink: true,
                                                                            tables: true)
    @markdown_renderer.render(content || '').html_safe
  end

  def react_component(class_name, props = {})
    content_tag(
      :div,
      nil,
      'data-react-class' => class_name,
      'data-props' => props.merge({
        graphqlCSRFToken: form_authenticity_token(form_options: { action: graphql_path,
                                                                  method: 'POST' })
      }).to_json
    )
  end
end
