module ApplicationHelper
  def markdown(content)
    @markdown_renderer ||= Redcarpet::Markdown.new(Redcarpet::Render::HTML, autolink: true,
                                                                            tables: true)
    @markdown_renderer.render(content || '').html_safe
  end

  def errors_for(object)
    return unless object.errors.any?

    content_tag(:div, class: 'card bg-danger') do
      concat(content_tag(:div, class: 'card-header') do
        concat(content_tag(:h4, class: 'm-0') do
          concat "#{pluralize(object.errors.count, 'error')} \
prohibited this #{object.class.name.downcase} from being saved:"
        end)
      end)
      concat(content_tag(:div, class: 'card-body') do
        concat(content_tag(:ul) do
          object.errors.full_messages.each do |msg|
            concat content_tag(:li, msg)
          end
        end)
      end)
    end
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
