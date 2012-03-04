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

        Crafty.e("2D, DOM, Text")
          .text(title)
          .attr({
            lat: lat,
            lng: lng,
            w: 100,
            h: 25
          })
          .css({ color: '#000', position: 'relative', left: '50px' })
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
    })
  }
}

function spawnExplodeEverything() {
  console.log("Exploding EVERYTHING!!!");
  var latLng = Game.helpers.getPlayerLatLng();
  Crafty.e("2D, DOM, preExplosion0, bombSprite").attr({ x: Game.player.x, y: Game.player.y });
  Crafty.e("2D, DOM, preExplosion1, bombSprite").attr({ x: Game.player.x, y: Game.player.y });
  Crafty.e("2D, DOM, preExplosion2, bombSprite").attr({ x: Game.player.x, y: Game.player.y });
  Crafty.e("2D, DOM, preExplosion3, bombSprite").attr({ x: Game.player.x, y: Game.player.y });

  setTimeout(function() {
    Crafty.e("2D, DOM, enemyDestroyingExplosion");
  }, 1000);
}

