namespace :larp_library do
  namespace :elasticsearch do
    desc "Create indexes and import all records"
    task setup: :environment do
      [Project, Tag].each do |klass|
        klass.__elasticsearch__.create_index!
        klass.import
      end
    end
  end
end
