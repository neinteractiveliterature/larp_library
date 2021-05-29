# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_05_29_172435) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "brand_memberships", id: :serial, force: :cascade do |t|
    t.integer "brand_id"
    t.integer "user_id"
    t.boolean "admin"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "invitation_token"
    t.text "invitation_email"
    t.index ["brand_id", "invitation_token"], name: "index_brand_memberships_on_brand_id_and_invitation_token", unique: true
    t.index ["brand_id"], name: "index_brand_memberships_on_brand_id"
    t.index ["user_id"], name: "index_brand_memberships_on_user_id"
  end

  create_table "brands", id: :serial, force: :cascade do |t|
    t.text "name", null: false
    t.text "slug", null: false
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "approved", default: false, null: false
    t.integer "creator_id"
    t.index ["slug"], name: "index_brands_on_slug", unique: true
  end

  create_table "project_files", id: :serial, force: :cascade do |t|
    t.integer "project_id"
    t.string "url", null: false
    t.string "filename", null: false
    t.string "filetype"
    t.integer "filesize", null: false
    t.string "filepath", null: false
    t.integer "uploader_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_project_files_on_project_id"
  end

  create_table "project_promotions", id: :serial, force: :cascade do |t|
    t.integer "project_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_project_promotions_on_project_id"
  end

  create_table "projects", id: :serial, force: :cascade do |t|
    t.text "title"
    t.text "authors"
    t.text "license"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "min_players"
    t.integer "max_players"
    t.integer "length_quantity"
    t.string "length_units"
    t.integer "publication_year"
    t.integer "brand_id"
    t.integer "min_facilitators"
    t.integer "max_facilitators"
    t.index ["brand_id"], name: "index_projects_on_brand_id"
  end

  create_table "projects_tags", id: false, force: :cascade do |t|
    t.integer "project_id"
    t.integer "tag_id"
    t.index ["project_id"], name: "index_projects_tags_on_project_id"
    t.index ["tag_id"], name: "index_projects_tags_on_tag_id"
  end

  create_table "tag_categories", id: :serial, force: :cascade do |t|
    t.text "name", null: false
    t.text "color"
    t.text "icon"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_tag_categories_on_name", unique: true
  end

  create_table "tags", id: :serial, force: :cascade do |t|
    t.text "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "tag_category_id"
    t.index ["name"], name: "index_tags_on_name"
    t.index ["tag_category_id"], name: "index_tags_on_tag_category_id"
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "username", default: "", null: false
    t.string "email"
    t.string "firstname"
    t.string "lastname"
    t.boolean "admin", default: false
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "brand_memberships", "brands"
  add_foreign_key "brand_memberships", "users"
  add_foreign_key "project_files", "projects"
  add_foreign_key "project_files", "users", column: "uploader_id"
  add_foreign_key "project_promotions", "projects"
  add_foreign_key "tags", "tag_categories"
end
