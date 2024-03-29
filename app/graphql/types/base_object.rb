# frozen_string_literal: true
module Types
  class BaseObject < GraphQL::Schema::Object
    edge_type_class(Types::BaseEdge)
    connection_type_class(Types::BaseConnection)
    field_class Types::BaseField

    def self.association_loader(model_class, association)
      define_method association do
        return object.public_send(association) if object.association(association).loaded?
        dataloader.with(Sources::ActiveRecordAssociation, model_class, association).load(object)
      end
    end

    def self.association_loaders(model_class, *associations)
      associations.each do |association|
        association_loader model_class, association
      end
    end

    def self.perform_authorization(action = :read)
      define_singleton_method :authorized? do |object, context|
        super(object, context) && context[:current_ability].can?(action, object)
      end
    end
  end
end
