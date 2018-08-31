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
end
