require 'omniauth-oauth2'
require 'graphql/client'
require 'graphql/client/http'

module OmniAuth
  module Strategies
    class Intercode < OmniAuth::Strategies::OAuth2
      IntercodeHTTP = GraphQL::Client::HTTP.new("#{ENV['INTERCODE_URL']}/graphql") do
        def headers(context)
          context[:headers] || {}
        end
      end
      IntercodeSchema = GraphQL::Client.load_schema(File.expand_path('intercode_schema.json', Rails.root))
      IntercodeClient = GraphQL::Client.new(schema: IntercodeSchema, execute: IntercodeHTTP)

      CurrentUserQuery = IntercodeClient.parse <<~GRAPHQL
        {
          currentUser {
            id
            first_name
            last_name
            email
          }
        }
      GRAPHQL

      # Give your strategy a name.
      option :name, 'intercode'

      # This is where you pass the options you would pass when
      # initializing your consumer from the OAuth gem.
      option :client_options, site: ENV['INTERCODE_URL']

      # These are called after authentication has succeeded. If
      # possible, you should try to set the UID without making
      # additional calls (if the user id is returned with the token
      # or as a URI parameter). This may not be possible with all
      # providers.
      uid do
        decoded_jwt['user']['id']
      end

      info do
        {
          first_name: raw_info.data.current_user.first_name,
          last_name: raw_info.data.current_user.last_name,
          email: raw_info.data.current_user.email
        }
      end

      # extra do
      #   {
      #     'raw_info' => raw_info
      #   }
      # end

      def raw_info
        @raw_info ||= IntercodeClient.query(CurrentUserQuery, context: { headers: access_token.headers })
      end

      def decoded_jwt
        @decoded_jwt ||= JSON::JWT.decode(access_token.token, jwk_set)
      end

      def jwk_set
        @jwk_set ||= JSON::JWK::Set.new(JSON.parse(jwk_response))
      end

      def jwk_response
        Rails.cache.fetch('intercode:jwk_response', expires_in: 1.hour) do
          Net::HTTP.get(URI("#{ENV['INTERCODE_URL']}/oauth/discovery/keys"))
        end
      end
    end
  end
end
