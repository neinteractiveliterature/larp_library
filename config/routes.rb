Rails.application.routes.draw do
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  end
  post "/graphql", to: "graphql#execute"
  devise_for :users

  get "/projects" => 'search_projects#index', as: :projects
  resources :projects, only: [:index]
  resources :project_promotions, only: [:index, :create, :destroy]

  resources :brands do
    collection do
      get :unapproved
    end

    member do
      patch :approve
    end

    get 'projects/:project_id/project_files/auth_upload' => 'project_files#auth_upload'
    get 'projects/:project_id' => 'single_page_app#show'
    get 'projects/:project_id/*extra' => 'single_page_app#show'
  end

  get "/brands/:brand_id/invitations/:id" => 'brand_memberships#pre_accept', as: 'pre_accept_brand_membership'
  post "/brands/:brand_id/invitations/:id" => 'brand_memberships#accept', as: 'accept_brand_membership'

  resources :tags, except: [:show]
  resources :tag_categories, except: [:show]

  root 'single_page_app#show'
end
