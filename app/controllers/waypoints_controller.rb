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
      event_data = JSON.parse(response.body)["events"]
      if event_data
        @@waypoints[key] = event_data.slice(1..-1).map do |data|
          e = data['event']
          v = e['venue']
          {title: e['title'],
           url: e['url'],
           latitude: v['latitude'],
           longitude: v['longitude']}
        end
      end
    end
    return @@waypoints[key]
  end
end
