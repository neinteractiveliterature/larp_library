Rails.application.routes.draw do
  devise_for :users

  get "/projects" => 'search_projects#index', as: :projects
  resources :projects, only: [:index]
  
  resources :brands do
    collection do
      get :unapproved
    end
    
    member do
      patch :approve
    end
    
    resources :projects, except: [:index] do
      resources :project_files, only: [:create, :show, :destroy]
    end
  end
    
  get "/brands/:brand_id/invitations/:id" => 'brand_memberships#pre_accept', as: 'pre_accept_brand_membership'
  post "/brands/:brand_id/invitations/:id" => 'brand_memberships#accept', as: 'accept_brand_membership'
  
  resources :tags, only: [:index]

  root 'search_projects#index'
end
