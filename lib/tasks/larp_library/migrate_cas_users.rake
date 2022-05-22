# frozen_string_literal: true

CASMigrationFindUsersByEmailQuery = IntercodeClient::Client.parse <<~GRAPHQL
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

# rubocop:disable Metrics/BlockLength
namespace :larp_library do
  task migrate_cas_users: :environment do
    oauth_client =
      OAuth2::Client.new(
        ENV.fetch("INTERCODE_MIGRATION_APP_ID"),
        ENV.fetch("INTERCODE_MIGRATION_APP_SECRET"),
        site: ENV.fetch("INTERCODE_URL")
      )

    puts <<~MESSAGE
    Please go to:
    #{oauth_client.auth_code.authorize_url(redirect_uri: "urn:ietf:wg:oauth:2.0:oob", scope: "public openid read_organizations")}
    And enter the code you get:
    MESSAGE

    code = $stdin.gets.strip
    token = oauth_client.auth_code.get_token(code, redirect_uri: "urn:ietf:wg:oauth:2.0:oob")

    missing_emails = []

    User
      .where(uid: nil)
      .where.not(username: nil)
      .find_each do |user|
        puts "Migrating #{user.username}"
        response =
          IntercodeClient::Client.query(
            CASMigrationFindUsersByEmailQuery,
            variables: {
              email: user.username
            },
            context: {
              headers: token.headers
            }
          )

        possible_users =
          response.data.users_paginated.entries.select do |intercode_user|
            intercode_user.email.casecmp(user.username).zero?
          end

        if possible_users.size != 1
          puts "WARNING!  Expected 1 user but found #{response.data.users_paginated.total_entries}"
          missing_emails << user.username if response.data.users_paginated.total_entries.zero?
          next
        end

        user.update!(provider: "intercode", uid: response.data.users_paginated.entries.first.to_h["id"])
      end

    if missing_emails.any?
      puts
      puts "Some users could not be imported because their email address didn't exist in Intercode."
      puts "To fix this, run bin/rails import:illyan ILLYAN_DB_URL=<url here> EMAILS='#{missing_emails.join(" ")}'"
    end
  end
end
# rubocop:enable Metrics/BlockLength
