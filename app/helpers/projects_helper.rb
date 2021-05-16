module ProjectsHelper
  def license_options
    Project::LICENSES.map do |key, license|
      [
        [
          license[:name],
          (license[:discouraged] ? " (#{discouraged_reason(license)})" : "")
        ].join(''),
        key
      ]
    end
  end

  def discouraged_reason(license)
    return 'discouraged, see our licensing page for details' unless license[:discouraged_reason]
    license[:discouraged_reason]
  end

  def tag_selector_input(tags)
    initial_value = tags.includes(:tag_category).map do |tag|
      {
        id: tag.id,
        name: tag.name,
        tagCategory: {
          id: tag.tag_category.id,
          name: tag.tag_category.name,
          color: tag.tag_category.color,
          textColor: tag.tag_category.text_color,
          icon: tag.tag_category.icon
        }
      }
    end

    react_component(
      "TagSelectorInput",
      name: 'project[tag_names][]',
      initialValue: initial_value
    )
  end
end
