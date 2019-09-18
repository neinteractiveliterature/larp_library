Rails.application.routes.draw do
  mount GraphiQL::Rails::Engine, at: '/graphiql', graphql_path: '/graphql' if Rails.env.development?
  post '/graphql', to: 'graphql#execute'
  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }
  devise_scope :user do
    delete 'sign_out', to: 'devise/sessions#destroy', as: :destroy_user_session
  end

  get '/brands/:brand_id/projects/:project_id/project_files/auth_upload' =>
    'project_files#auth_upload'

  get '/(*extra)' => 'single_page_app#show', as: 'root', constraints: {
    extra: %r{(?!(uploads|packs|assets)/).*}
  }
end
