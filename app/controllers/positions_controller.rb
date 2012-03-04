class PositionsController < ApplicationController

  def update
    p = Position.find_or_create_by_user_id(session[:user_id])
    p.lat = params[:lat]
    p.lng = params[:lng]
    p.save
    render :nothing => true
  end

  def show
    if (p = Position.find_by_user_id(params[:id]))
      render :json => {
        :user_id => p.user_id,
        :lat => p.lat,
        :lng => p.lng
      }
    else
      render :json => {}
    end
  end

end
