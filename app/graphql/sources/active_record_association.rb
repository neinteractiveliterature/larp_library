# frozen_string_literal: true
class Sources::ActiveRecordAssociation < GraphQL::Dataloader::Source
  def initialize(model_class, association_name)
    super()

    @model_class = model_class
    @association_name = association_name

    # rubocop:disable Style/GuardClause
    unless @model_class.reflect_on_association(@association_name)
      raise ArgumentError, "#{@model_class} has no association called #{@association_name}"
    end
    # rubocop:enable Style/GuardClause
  end

  def fetch(records)
    ::ActiveRecord::Associations::Preloader.new.preload(records, @association_name)
    records.map { |record| record.public_send(@association_name) }
  end
end
