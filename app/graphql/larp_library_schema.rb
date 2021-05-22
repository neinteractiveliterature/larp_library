class LarpLibrarySchema < GraphQL::Schema
  class NotAuthorizedError < GraphQL::ExecutionError
    attr_reader :current_user

    def self.from_error(error, message, **args)
      new(message, current_user: error.context[:current_user], **args)
    end

    def initialize(message, current_user:, **args)
      super(message, **args)
      @current_user = current_user
    end

    def message
      if current_user
        super
      else
        'Not logged in'
      end
    end

    def code
      if current_user
        'NOT_AUTHORIZED'
      else
        'NOT_AUTHENTICATED'
      end
    end

    def to_h
      super.merge(
        'extensions' => {
          'code' => code,
          "current_user_id": current_user&.id
        }
      )
    end
  end

  mutation(Types::MutationType)
  query(Types::QueryType)

  default_max_page_size 25

  use GraphQL::Dataloader

  connections.add(SearchRequest, Connections::SearchRequestConnection)

  rescue_from ActiveRecord::RecordInvalid do |err, _obj, _args, _ctx, _field|
    raise GraphQL::ExecutionError.new(
      "Validation failed for #{err.record.class.name}: \
#{err.record.errors.full_messages.join(', ')}",
      extensions: {
        validationErrors: err.record.errors.as_json
      }
    )
  end

  rescue_from ActiveRecord::RecordNotFound do |_err, _obj, _args, _ctx, field|
    type_name = field.type.unwrap.graphql_name

    if type_name == 'Boolean'
      raise GraphQL::ExecutionError, "Record not found while evaluating #{field.name}"
    end

    raise GraphQL::ExecutionError, "#{field.type.unwrap.graphql_name} not found"
  end

  # Union and Interface Resolution
  def self.resolve_type(_abstract_type, _obj, _ctx)
    # TODO: Implement this function
    # to return the correct object type for `obj`
    raise(GraphQL::RequiredImplementationMissingError)
  end

  # Relay-style Object Identification:

  # Return a string UUID for `object`
  def self.id_from_object(object, type_definition, query_ctx)
    # Here's a simple implementation which:
    # - joins the type name & object.id
    # - encodes it with base64:
    # GraphQL::Schema::UniqueWithinType.encode(type_definition.name, object.id)
  end

  # Given a string UUID, find the object
  def self.object_from_id(id, query_ctx)
    # For example, to decode the UUIDs generated above:
    # type_name, item_id = GraphQL::Schema::UniqueWithinType.decode(id)
    #
    # Then, based on `type_name` and `id`
    # find an object in your application
    # ...
  end

  def self.unauthorized_object(error)
    # Add a top-level error to the response instead of returning nil:
    raise NotAuthorizedError.from_error(
      error,
      "An object of type #{error.type.graphql_name} was hidden due to permissions"
    )
  end
end
