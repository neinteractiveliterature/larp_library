# frozen_string_literal: true

# Serves the app shell: the static index.html that `yarn build` produces (see bin/build-frontend).  It's the same for
# every URL and every visitor; anything specific to the visitor comes from AppConfigController.
class SinglePageAppController < ApplicationController
  SHELL_PATH = Rails.public_path.join("packs/index.html")

  def show
    if SHELL_PATH.exist?
      # no-cache means "revalidate before reuse": the shell names the current hashed asset files, so it has to be
      # fresh after a deploy, while the assets themselves can be cached forever
      response.headers["Cache-Control"] = "no-cache"
      send_file SHELL_PATH, type: "text/html", disposition: "inline"
    elsif Rails.env.development?
      # The shell only exists after a production build; in development the Vite dev server serves the app
      redirect_to "#{ENV.fetch("VITE_DEV_URL", "http://localhost:3042")}#{request.fullpath}", allow_other_host: true
    else
      render plain: "The frontend build is missing (expected #{SHELL_PATH})", status: :service_unavailable
    end
  end
end
