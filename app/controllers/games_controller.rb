class GamesController < ApplicationController

  def index
    GameEventWorker.new.queue
    p = Position.find_by_user_id(session[:user_id])
    if p
      @loc = [p.lat.to_f, p.lng.to_f]
    else
      @loc = [37.794254, -122.419453]
    end
  end
end
