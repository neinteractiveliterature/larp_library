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
    s3 = Aws::S3::Client.new
    s3.delete_object({
      bucket: s3_bucket,
      key: s3_key
    })
  end

  def s3_key
    CGI.unescape filepath.gsub(%r(\A/#{s3_bucket}/), '')
  end

  def s3_bucket
    ENV['AWS_S3_BUCKET'] || "larp-library-#{Rails.env}"
  end
end
