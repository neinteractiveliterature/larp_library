# frozen_string_literal: true
class ProjectFilesController < ApplicationController
  load_resource :brand, find_by: :slug
  load_resource :project, through: :brand
  load_and_authorize_resource through: :project

  respond_to :json

  def auth_upload
    signer =
      Aws::Sigv4::Signer.new(
        service: "s3",
        region: ENV.fetch("AWS_REGION"),
        access_key_id: ENV.fetch("AWS_ACCESS_KEY_ID"),
        secret_access_key: ENV.fetch("AWS_SECRET_ACCESS_KEY")
      )
    signature = signer.sign_request(http_method: params[:http_method], url: params[:url], headers: params[:headers])

    render json: signature.headers, status: :ok
  end
end
