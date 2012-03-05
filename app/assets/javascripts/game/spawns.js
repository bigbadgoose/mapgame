function spawnGhost(data) {
  // console.log("Ghost spawn!!!");
  Crafty.e(data.components).attr({
    lat: data.latLng[0],
    lng: data.latLng[1],
    latSpeed: -0.00002*data.v[0],
    lngSpeed: 0.00002*data.v[1],
    bullets: data.bullets
  });
}

function generateWaypoint(title, lat, lng) {
  Game.waypoints.current = Crafty.e("2D, DOM, waypoint, waypointSprite").attr({
    lat: lat,
    lng: lng,
    w: 64,
    h: 64
  });

  Game.waypointText = Crafty.e("2D, DOM, Text")
    .text(title)
    .attr({
      lat: lat,
      lng: lng,
      w: 100,
      h: 25
    })
    .css({
      color: '#000',
      position: 'relative',
      left: '50px',
      background: "white",
      border: "1px solid black",
      padding: "3px",
      "min-width": "250px",
      "min-height": "70px"
    })
    .bind("EnterFrame", function() {
      if (Crafty.frame() % 2 == 0) {
        if (this.lat && this.lng) {
          var xy = Game.helpers.latLngtoXY([this.lat, this.lng]);
          this.x = xy[0];
          this.y = xy[1];
        }
      }
    });
}

function spawnNextWaypoint(fetchWaypoint, cb) {
  window.waypointIndex = window.waypointIndex || 0;
  if (Game.waypoints.current) {
    Game.waypoints.current.destroy();
    if (Game.waypointText) {
      Game.waypointText.destroy();
    }
  }
  if (fetchWaypoint) {
    window.waypointIndex = window.waypointIndex + 1;
    $.getJSON('/waypoint/'+window.waypointIndex, function(data) {
      if (data) {
        var lat = data['latitude'];
        var lng = data['longitude'];
        var title = data['title'];
        generateWaypoint(title, lat, lng);
        cb && cb(data);
      }
    })
  } else {
    if (typeof(cb) == 'object') {
      var data = cb;
      var lat = data['latitude'];
      var lng = data['longitude'];
      var title = data['title'];
      generateWaypoint(title, lat, lng);
    }
  }
}

function spawnExplodeEverything() {
  // console.log("Exploding EVERYTHING!!!");

  var latLng = Game.helpers.getPlayerLatLng();
  Crafty.e("2D, DOM, preExplosion0, bombSprite").attr({ x: Game.player.x, y: Game.player.y });
  Crafty.e("2D, DOM, preExplosion1, bombSprite").attr({ x: Game.player.x, y: Game.player.y });
  Crafty.e("2D, DOM, preExplosion2, bombSprite").attr({ x: Game.player.x, y: Game.player.y });
  Crafty.e("2D, DOM, preExplosion3, bombSprite").attr({ x: Game.player.x, y: Game.player.y });

  setTimeout(function() {
    Crafty.e("2D, DOM, enemyDestroyingExplosion");
  }, 1000);
}

