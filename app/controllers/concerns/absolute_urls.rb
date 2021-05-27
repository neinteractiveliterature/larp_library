module AbsoluteUrls
  def default_url_scheme
    Rails.env.production? ? 'https' : 'http'
  end

  def default_url_host
    Rails.configuration.action_mailer.default_url_options[:host]
  end

  def absolute_url(url, host: nil, scheme: nil)
    uri = URI(url)
    uri.host = (host || default_url_host)
    uri.scheme = (scheme || default_url_scheme)
    uri.to_s
  end
end
