namespace :larp_library do
  namespace :elasticsearch do
    desc 'Create indexes and import all records'
    task setup: :environment do
      [Project, Tag].each do |klass|
        puts "Importing #{klass.count} #{klass.name.pluralize}"
        klass.__elasticsearch__.create_index! force: klass.__elasticsearch__.index_exists?
        klass.import
      end
    end
  end
end
