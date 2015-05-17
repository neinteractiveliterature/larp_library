Rails.application.routes.draw do
  devise_for :users

  resources :projects do
    resources :project_files, only: [:create, :show]
  end

  root 'projects#index'
end
