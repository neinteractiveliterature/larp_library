# frozen_string_literal: true
module Types
  class LicenseType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :url, String, null: false
    field :logo_url, String, null: true
    field :dedication_html, String, null: true
    field :discouraged, Boolean, null: false
    field :discouraged_reason, String, null: true

    def discouraged
      object[:discouraged] || false
    end

    def discouraged_reason
      return nil unless discouraged
      return "discouraged, see our licensing page for details" unless object[:discouraged_reason]
      object[:discouraged_reason]
    end
  end
end
