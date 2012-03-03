class PusherController < ApplicationController
  protect_from_forgery :except => :auth

  def auth
    pusher_response = Pusher[params[:channel_name]].authenticate(params[:socket_id], {
     :user_id => session[:user_id]
    })
    render :json => pusher_response
  end
end
