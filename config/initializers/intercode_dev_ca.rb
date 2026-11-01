# frozen_string_literal: true

# In development, Intercode is served over HTTPS with a certificate from its own local CA (dev_ca.crt in the Intercode
# repo), which Ruby doesn't trust.  Signing in then fails when Rails calls Intercode, with "certificate verify failed
# (self-signed certificate in certificate chain)".  Point INTERCODE_DEV_CA_FILE at that file (e.g. in
# .env.development.local) to trust it.
#
# Signing in makes two kinds of request to Intercode, and they get their certificates from different places:
# the OAuth token exchange uses Faraday, which builds its own store, and the user lookup uses Net::HTTP, which uses
# Ruby's default one.  (Setting SSL_CERT_FILE would only cover the first, since Ruby has read it before dotenv runs.)
if Rails.env.development? && ENV["INTERCODE_DEV_CA_FILE"].present?
  ca_file = ENV.fetch("INTERCODE_DEV_CA_FILE")

  Faraday.default_connection_options = Faraday::ConnectionOptions.from(ssl: { ca_file: ca_file })
  OpenSSL::SSL::SSLContext::DEFAULT_CERT_STORE.add_file(ca_file)
end
