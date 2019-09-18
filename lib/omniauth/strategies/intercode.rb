require 'omniauth-oauth2'
require 'graphql/client'
require 'graphql/client/http'
require 'intercode_client'

module OmniAuth
  module Strategies
    class Intercode < OmniAuth::Strategies::OAuth2
      CurrentUserQuery = IntercodeClient::Client.parse <<~GRAPHQL
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

      extra do
        {
          'access_token' => access_token.token,
          'raw_info' => raw_info.to_h
        }
      end

      def raw_info
        @raw_info ||= IntercodeClient::Client.query(
          CurrentUserQuery,
          context: { headers: access_token.headers }
        )
      end

      def decoded_jwt
        @decoded_jwt ||= IntercodeClient.decode_jwt(access_token.token)
      end
    end
  end
end
