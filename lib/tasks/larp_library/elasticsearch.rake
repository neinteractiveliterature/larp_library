namespace :larp_library do
  namespace :elasticsearch do
    desc "Create indexes and import all records"
    task setup: :environment do
      Project.__elasticsearch__.create_index! force: true

      [Project, Tag].each do |klass|
        puts "Importing #{klass.count} #{klass.name.pluralize}"
        klass.__elasticsearch__.client.indices.put_mapping(
          type: klass.__elasticsearch__.document_type,
          index: klass.__elasticsearch__.index_name,
          body: klass.__elasticsearch__.mappings.to_hash
        )
        klass.import
      end
    end
  end
end
