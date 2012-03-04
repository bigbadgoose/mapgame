function spawnGhost(data) {
  console.log("Ghost spawn!!!");
  Crafty.e(data.components).attr({
    lat: data.latLng[0],
    lng: data.latLng[1],
    latSpeed: -0.00002*data.v[0],
    lngSpeed: 0.00002*data.v[1],
    bullets: data.bullets
  });
}

function spawnNextWaypoint(data) {
  var createWaypoint = false;
  if (data && data.index) {
    var i = data.index;
  } else {
    var i = Game.waypoints.index;
  }
  if (Game.waypoints.current) {
    if (Game.waypoints.current.index !== i) {
      Game.waypoints.current.destroy();
      createWaypoint = true;
    }
  } else {
    createWaypoint = true;
  }
  if (createWaypoint) {
    $.getJSON('/waypoint/'+i, function(data) {
      if (data) {
        var lat = data['latitude'];
        var lng = data['longitude'];
        var title = data['title'];  // make use of this?
        Game.waypoints.current = Crafty.e("2D, DOM, waypoint, waypointSprite").attr({
          index: i,
          lat: lat,
          lng: lng,
          w: 64,
          h: 64
        });
      }
    })
    // if (i == Game.waypoints.list.length) {
    //   M.log("All waypoints have been reached!");
    // } else {
    //   M.log("Waypoint " + i + " has been spawned!");
    //   Game.waypoints.current = Crafty.e("2D, DOM, waypoint, waypointSprite").attr({
    //     index: i,
    //     lat: Game.waypoints.list[i][0],
    //     lng: Game.waypoints.list[i][1],
    //     w: 64,
    //     h: 64
    //   });
    // }
  }
}
