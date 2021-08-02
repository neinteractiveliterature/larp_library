class ConvertIconsToBootstrap < ActiveRecord::Migration[6.1]
  ICON_MAP = {
    'user-secret': 'lock-fill',
    'puzzle-piece': 'puzzle-fill',
    'exclamation-triangle': 'exclamation-triangle-fill',
    'cogs': 'gear-wide-connected',
    'film': 'film',
    'bank': 'bank2',
    'list-ol': 'list-ol'
  }

  def change
    mapping = reverting? ? ICON_MAP.invert : ICON_MAP

    mapping.each do |from_value, to_value|
      next if from_value == to_value
      say "Switching #{from_value} to #{to_value}"
      TagCategory.where(icon: from_value).update_all(icon: to_value)
    end
  end
end
