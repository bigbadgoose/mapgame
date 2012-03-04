class WaypointsController < ApplicationController
  def next
    key = params[:key] || 'party'
    list = self.class.waypoints(key)
    index = (params[:id].to_i % list.size) rescue 0
    render :json => list[index]
  end

  protected
  def self.waypoints(key)
    @@waypoints ||= Hash.new
    unless @@waypoints[key]
      response = EB_CLIENT.event_search({keywords: key, city: 'san francisco'})
      events = JSON.parse(response.body)["events"]
      if events
        @@waypoints[key] = events.slice(1..-1)
      end
    end
    return @@waypoints[key]
  end
end
