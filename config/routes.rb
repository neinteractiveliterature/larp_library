# frozen_string_literal: true
Rails.application.routes.draw do
  mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql" if Rails.env.development?
  post "/graphql", to: "graphql#execute"

  devise_for :users, controllers: { sessions: "sessions", omniauth_callbacks: "users/omniauth_callbacks" }

  devise_scope :user do
    delete "/users/sign_out", to: "devise/sessions#destroy", as: :destroy_user_session
  end

  get "/(*extra)" => "single_page_app#show", :as => "root", :constraints => { extra: %r{(?!(uploads|packs|assets)/).*} }
end
