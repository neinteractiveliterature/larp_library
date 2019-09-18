namespace :larp_library do
  task :migrate_cas_users => :environment do
    FindUsersByEmailQuery = IntercodeClient::Client.parse <<~GRAPHQL
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

    missing_emails = []

    User.where(uid: nil).where.not(cas_username: nil).find_each do |user|
      puts "Migrating #{user.cas_username}"
      response = IntercodeClient::Client.query(
        FindUsersByEmailQuery,
        variables: { email: user.cas_username },
        context: { headers: token.headers }
      )

      possible_users = response.data.users_paginated.entries.select do |intercode_user|
        intercode_user.email.downcase == user.cas_username.downcase
      end

      if possible_users.size != 1
        puts "WARNING!  Expected 1 user but found #{response.data.users_paginated.total_entries}"
        missing_emails << user.cas_username if response.data.users_paginated.total_entries == 0
        next
      end

      user.update!(provider: 'intercode', uid: response.data.users_paginated.entries.first.id)
    end

    if missing_emails.any?
      puts
      puts "Some users could not be imported because their email address didn't exist in Intercode."
      puts "To fix this, run bin/rails import:illyan ILLYAN_DB_URL=<url here> EMAILS='#{missing_emails.join(' ')}'"
    end
  end
end
