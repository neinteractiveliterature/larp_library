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
    s3 = Fog::Storage.new(provider: "AWS", aws_access_key_id: S3DirectUpload.config.access_key_id, aws_secret_access_key: S3DirectUpload.config.secret_access_key)
    bucket = s3.directories.get(S3DirectUpload.config.bucket)
    file = bucket.files.get(s3_key)
    file.destroy
  end
  
  def s3_key
    CGI.unescape filepath.gsub(%r(\A/#{S3DirectUpload.config.bucket}/), '')
  end
end
