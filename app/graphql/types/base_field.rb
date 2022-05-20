# frozen_string_literal: true
module Types
  class BaseField < GraphQL::Schema::Field
    argument_class Types::BaseArgument

    def initialize(*args, required_permission: nil, **kwargs, &block)
      @required_permission = required_permission
      if required_permission && !kwargs[:null]
        raise ArgumentError,
"Field #{kwargs[:owner].graphql_name}.#{kwargs[:name]} specified required_permission but is \
not nullable"
      end

      # Pass on the default args:
      super(*args, **kwargs, &block)
    end

    attr_reader :required_permission

    def resolve(object, arguments, context)
      return nil if required_permission && !context[:current_ability].can?(required_permission, object)

      super
    end
  end
end
