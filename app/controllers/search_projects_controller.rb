class SearchProjectsController < ApplicationController
  def index
    must_queries = []
    if params[:q].present?
      must_queries << {
        multi_match: {
          query: params[:q],
          fields: ['title^3', 'authors^2', 'brand_name^2', 'tag_names^2', 'description'],
          fuzziness: 'AUTO'
        }
      }
    elsif params[:tag].present?
      must_queries << {
        term: {
          tag_names: params[:tag]
        }
      }
    end
    
    query = if must_queries.any?
      {
        bool: {
          must: must_queries
        }
      }
    else
      {
        match_all: {}
      }
    end
    
    @projects = Project.search(query: query, sort: ["_score", "title"]).page(params[:page]).records
  end
end
