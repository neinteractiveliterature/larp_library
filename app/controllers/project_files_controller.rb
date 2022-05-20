# frozen_string_literal: true
class ProjectFilesController < ApplicationController
  load_resource :brand, find_by: :slug
  load_resource :project, through: :brand
  load_and_authorize_resource through: :project

  respond_to :json

  def auth_upload
    digest = OpenSSL::Digest.new("sha1")
    hmac = OpenSSL::HMAC.digest(digest, ENV["AWS_SECRET_ACCESS_KEY"].encode("UTF-8"),
request["to_sign"].encode("UTF-8"))
    hmac64 = Base64.encode64(hmac).chomp

    render plain: hmac64, status: :ok
  end
end
