namespace :larp_library do
  task :migrate_cas_users => :environment do
    FindUsersByEmailQuery = OmniAuth::Strategies::Intercode::IntercodeClient.parse <<~GRAPHQL
      query($email: String!) {
        users_paginated(filters: { email: $email }) {
          total_entries
          entries {
            id
            email
          }
        }
      }
    GRAPHQL

    oauth_client = OAuth2::Client.new(
      ENV['INTERCODE_MIGRATION_APP_ID'],
      ENV['INTERCODE_MIGRATION_APP_SECRET'],
      site: ENV['INTERCODE_URL']
    )

    puts <<~EOF
    Please go to:
    #{oauth_client.auth_code.authorize_url(redirect_uri: 'urn:ietf:wg:oauth:2.0:oob', scope: 'public openid read_organizations')}

    And enter the code you get:
    EOF

    code = STDIN.gets.strip
    token = oauth_client.auth_code.get_token(code, redirect_uri: 'urn:ietf:wg:oauth:2.0:oob')

    User.where(uid: nil).where.not(cas_username: nil).find_each do |user|
      puts "Migrating #{user.cas_username}"
      response = OmniAuth::Strategies::Intercode::IntercodeClient.query(
        FindUsersByEmailQuery,
        variables: { email: user.cas_username },
        context: { headers: token.headers }
      )

      if response.data.users_paginated.total_entries != 1
        puts "WARNING!  Expected 1 user but found #{response.data.users_paginated.total_entries}"
        next
      end

      user.update!(provider: 'intercode', uid: response.data.users_paginated.entries.first.id)
    end
  end
end
