class GamesController < ApplicationController

  ARENA_WIDTH = 960;
  ARENA_HEIGHT = 600;

  def index
    @loc = [37.794254, -122.419453];
  end
end
