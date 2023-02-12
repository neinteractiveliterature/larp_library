# frozen_string_literal: true
module Mutations
  class SetReturnUrl < BaseMutation
    argument :return_url, String, required: true

    def resolve(return_url:)
      context[:session][:user_return_to] = return_url
      {}
    end
  end
end
