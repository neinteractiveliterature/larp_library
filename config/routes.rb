Rails.application.routes.draw do
  devise_for :users

  resources :projects do
    resources :project_files, only: [:create, :show, :destroy]
  end
  
  resources :tags, only: [:index]

  root 'projects#index'
end
