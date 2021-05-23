Rails.application.routes.draw do
  mount GraphiQL::Rails::Engine, at: '/graphiql', graphql_path: '/graphql' if Rails.env.development?
  post '/graphql', to: 'graphql#execute'

  devise_for :users, controllers: {
    sessions: 'sessions',
    cas_sessions: 'sessions'
  }

  resources :tags, except: [:show]
  resources :tag_categories, except: [:show]

  get '/(*extra)' => 'single_page_app#show', as: 'root', constraints: {
    extra: %r{(?!(uploads|packs|assets)/).*}
  }
end
