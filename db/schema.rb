# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160225202721) do

  create_table "brand_memberships", force: :cascade do |t|
    t.integer  "brand_id"
    t.integer  "user_id"
    t.boolean  "admin"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.text     "invitation_token"
    t.text     "invitation_email"
  end

  add_index "brand_memberships", ["brand_id", "invitation_token"], name: "index_brand_memberships_on_brand_id_and_invitation_token", unique: true
  add_index "brand_memberships", ["brand_id"], name: "index_brand_memberships_on_brand_id"
  add_index "brand_memberships", ["user_id"], name: "index_brand_memberships_on_user_id"

  create_table "brands", force: :cascade do |t|
    t.text     "name",                        null: false
    t.text     "slug",                        null: false
    t.text     "description"
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.boolean  "approved",    default: false, null: false
    t.integer  "creator_id"
  end

  add_index "brands", ["slug"], name: "index_brands_on_slug", unique: true

  create_table "project_files", force: :cascade do |t|
    t.integer  "project_id"
    t.string   "url"
    t.string   "filename"
    t.string   "filetype"
    t.integer  "filesize"
    t.string   "filepath"
    t.integer  "uploader_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "project_files", ["project_id"], name: "index_project_files_on_project_id"

  create_table "project_promotions", force: :cascade do |t|
    t.integer  "project_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "project_promotions", ["project_id"], name: "index_project_promotions_on_project_id"

  create_table "projects", force: :cascade do |t|
    t.text     "title"
    t.text     "authors"
    t.text     "license"
    t.text     "description"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.integer  "min_players"
    t.integer  "max_players"
    t.integer  "length_quantity"
    t.string   "length_units"
    t.integer  "publication_year"
    t.integer  "brand_id"
  end

  add_index "projects", ["brand_id"], name: "index_projects_on_brand_id"

  create_table "projects_tags", id: false, force: :cascade do |t|
    t.integer "project_id"
    t.integer "tag_id"
  end

  add_index "projects_tags", ["project_id"], name: "index_projects_tags_on_project_id"
  add_index "projects_tags", ["tag_id"], name: "index_projects_tags_on_tag_id"

  create_table "tags", force: :cascade do |t|
    t.text     "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "tags", ["name"], name: "index_tags_on_name"

  create_table "users", force: :cascade do |t|
    t.string   "username",           default: "",    null: false
    t.string   "email"
    t.string   "firstname"
    t.string   "lastname"
    t.boolean  "admin",              default: false
    t.integer  "sign_in_count",      default: 0,     null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["username"], name: "index_users_on_username", unique: true

end
