class ProjectFile < ActiveRecord::Base
  belongs_to :project
  belongs_to :uploader, class_name: "User"

  after_destroy :delete_s3_file

  def filepath=(filepath)
    write_attribute :filepath, CGI.unescape(filepath)
  end

  def url=(url)
    write_attribute :url, CGI.unescape(url)
  end

  private
  def delete_s3_file
    s3 = Fog::Storage.new(provider: "AWS", aws_access_key_id: ENV['AWS_ACCESS_KEY_ID'], aws_secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'])
    bucket = s3.directories.get(ENV['AWS_S3_BUCKET'] || "larp-library-#{Rails.env}")
    file = bucket.files.get(s3_key)
    file.destroy
  end

  def s3_key
    CGI.unescape filepath.gsub(%r(\A/#{S3DirectUpload.config.bucket}/), '')
  end
end
