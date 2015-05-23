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

ActiveRecord::Schema.define(version: 20150523164556) do

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

  create_table "projects", force: :cascade do |t|
    t.text     "title"
    t.text     "authors"
    t.text     "license"
    t.text     "description"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

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
