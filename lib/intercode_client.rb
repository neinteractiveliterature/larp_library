module IntercodeClient
  HTTP = GraphQL::Client::HTTP.new("#{ENV['INTERCODE_URL']}/graphql") do
    def headers(context)
      context[:headers] || {}
    end
  end
  Schema = GraphQL::Client.load_schema(
    File.expand_path('intercode_schema.json', Rails.root)
  )
  Client = GraphQL::Client.new(schema: Schema, execute: HTTP)

  def self.decode_jwt(jwt)
    JSON::JWT.decode(jwt, IntercodeClient.jwk_set)
  end

  def self.jwk_set
    JSON::JWK::Set.new(JSON.parse(jwk_response))
  end

  def self.jwk_response
    Rails.cache.fetch('intercode:jwk_response', expires_in: 1.hour) do
      Net::HTTP.get(URI("#{ENV['INTERCODE_URL']}/oauth/discovery/keys"))
    end
  end
end
