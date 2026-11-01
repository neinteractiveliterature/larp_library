# frozen_string_literal: true

# Values the static app shell can't know ahead of time because they differ per request (CSRF tokens, who's signed in)
# or per deployment (Sentry, S3).  The frontend fetches this once, as the root route's clientLoader.
class AppConfigController < ApplicationController
  def show
    # CSRF tokens must never be shared between visitors, so keep this out of every cache
    response.headers["Cache-Control"] = "no-store"

    render json: {
             graphqlCSRFToken: form_authenticity_token(form_options: { action: graphql_path, method: "POST" }),
             signInCSRFToken:
               form_authenticity_token(form_options: { action: "/users/auth/intercode", method: "POST" }),
             signOutCSRFToken: form_authenticity_token(form_options: { action: "/" }),
             s3Configuration: {
               awsRegion: ENV.fetch("AWS_REGION", nil),
               bucketName: ProjectFile.s3_bucket
             },
             sentryDsn: ENV["SENTRY_DSN"].presence,
             currentUserId: current_user&.id
           }
  end
end
