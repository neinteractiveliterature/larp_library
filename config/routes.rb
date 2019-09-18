Rails.application.routes.draw do
  mount GraphiQL::Rails::Engine, at: '/graphiql', graphql_path: '/graphql' if Rails.env.development?
  post '/graphql', to: 'graphql#execute'
  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }

  # Working around Illyan's lack of CORS; we can get rid of this when we switch to Intercode OAuth2
  devise_scope :user do
    get '/users/sign_out' => 'sessions#destroy'
  end

  get '/brands/:brand_id/projects/:project_id/project_files/auth_upload' =>
    'project_files#auth_upload'

  get '/(*extra)' => 'single_page_app#show', as: 'root', constraints: {
    extra: %r{(?!(uploads|packs|assets)/).*}
  }
end
