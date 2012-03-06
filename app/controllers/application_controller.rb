class ApplicationController < ActionController::Base
  protect_from_forgery

  before_filter do
    session[:user_id] = SecureRandom.hex(16)
  end
end
