# frozen_string_literal: true
module ApplicationHelper
  def markdown(content)
    @markdown_renderer ||= Redcarpet::Markdown.new(Redcarpet::Render::HTML, autolink: true, tables: true)
    @markdown_renderer.render(content || "").html_safe # rubocop:disable Rails/HelperInstanceVariable, Rails/OutputSafety
  end

  def react_component(class_name, props = {})
    tag.div(
      nil,
      "data-react-class" => class_name,
      "data-props" =>
        props.merge(
          { graphqlCSRFToken: form_authenticity_token(form_options: { action: graphql_path, method: "POST" }) }
        ).to_json
    )
  end
end
