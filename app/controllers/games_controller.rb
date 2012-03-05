class GamesController < ApplicationController

  def index
    # GameEventWorker.new.queue
    # p = Position.find_by_user_id(session[:user_id])
    # if p
    #   @loc = [p.lat.to_f, p.lng.to_f]
    @loc = [37.771868165425545, -122.40201214878846]
  end
end
