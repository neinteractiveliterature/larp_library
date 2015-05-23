module ApplicationHelper
  def markdown(content)
    @markdown_renderer ||= Redcarpet::Markdown.new(Redcarpet::Render::HTML, autolink: true, tables: true)
    @markdown_renderer.render(content).html_safe
  end
end
