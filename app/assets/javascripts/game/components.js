// Player character component
Crafty.c("playerComponent", {
  init: function() {
    this.origin("center");
    this.attr({
      xspeed: 3,
      yspeed: 3,
      x: 30,
      y: 30,
      z: 30,
    });
    this.addComponent("Collision")
      .collision()
      .onHit("powerup", function() {
        console.log("Got a powerup!");
      })
      .onHit("waypoint", function(e) {
        console.log("Waypoint reached!");
        Game.waypoints.index++;
        var data = {
          index: Game.waypoints.index
        };
        spawnNextWaypoint(data);
        Game.pubsub.trigger("client-waypoint_reached", data);
      })
      .onHit("enemyBullet", function(e) {
        e[0].obj.destroy();
        console.log("OUCH");
      });
  }
});

Crafty.c("otherPlayerComponent", {
  init: function() {
    this.bind("EnterFrame", function() {
      if (Crafty.frame() % 2 == 0) {
        var data = Game.otherPlayers[this.player_id];
        if (data.lat && data.lng) {
          var xy = Game.helpers.latLngtoXY([data.lat, data.lng]);
          this.x = xy[0];
          this.y = xy[1];
          this.z = xy[1];
        } else {
          this.x = -100;
          this.y = -100;
          this.z = -100;
        }
      }
    });
  }
});

// Enemy components
Crafty.c("ghostComponent", {
  init: function() {
    this.origin("center");
    this.attr({
      latSpeed: -0.00002,
      lngSpeed: 0.00002,
      w: 32,
      h: 48,
      frame: 0
    });
    this.bind("EnterFrame", function() {
      if (this.lat && this.lng) {
        var xy = Game.helpers.latLngtoXY([this.lat, this.lng]);
        this.x = xy[0];
        this.y = xy[1];
        this.lat += this.latSpeed;
        this.lng += this.lngSpeed;
      }
      var x = this.x,
          y = this.y;
      if (Crafty.frame() % 30 == 0) {
        var v = this.bullets.pop();
        if (v) {
          Crafty.e("2D, DOM, Color, bullet, enemyBullet").color("red").attr({
            lat: this.lat,
            lng: this.lng,
            w: 6,
            h: 6,
            latSpeed: -0.00005*v[0],
            lngSpeed: 0.00005*v[1],
          });
        }
      }
      this.frame++;
      if (this.frame > 120) {
        this.destroy();
      }
    });
    this.addComponent("Collision")
      .collision()
      .onHit("playerBullet", function(e) {
        this.destroy();
        e[0].obj.destroy();
      });
  }
});


// Misc entities
Crafty.c("bullet", {
  init: function() {
    this.attr({
      frame: 0
    });
    this.bind("EnterFrame", function() {
      if (this.lat && this.lng) {
        var xy = Game.helpers.latLngtoXY([this.lat, this.lng]);
        this.x = xy[0];
        this.y = xy[1];
        this.lat += this.latSpeed;
        this.lng += this.lngSpeed;
      }
      this.frame++;
      if (this.frame > 120) {
        this.destroy();
      }
    });
  }
});

Crafty.c("waypoint", {
  init: function() {
    this.attr({
      x: -100,
      y: -100
    });
    this.bind("EnterFrame", function() {
      if (Crafty.frame() % 2 == 0) {
        if (this.lat && this.lng) {
          var xy = Game.helpers.latLngtoXY([this.lat, this.lng]);
          this.x = xy[0];
          this.y = xy[1];
        }
      }
    });
  }
});

Crafty.c("arrow", {
  init: function() {
    this.attr({
      r: 275,
      rsq: 275*275,
      visible: false
    });
    this.bind("EnterFrame", function() {
      var waypoint = Game.waypoints.current;
      if (waypoint && Crafty.frame() % 5 == 0) {
        var y_angle = waypoint.y-300+20;
        var x_angle = waypoint.x-480;
        this.visible = (y_angle*y_angle+x_angle*x_angle < this.rsq) ? false : true
        var angle = Math.atan(-y_angle/x_angle);
        if (x_angle < 0) {
          angle += Math.PI;
        }
        this.x = 480 + this.r*Math.cos(angle);
        this.y = 300 - this.r*Math.sin(angle);
        this.rotation = 90 - 180*angle/Math.PI;
      }
      if (!waypoint && Crafty.frame() % 60 == 0) {
        this.visible = false;
      }
    });
  }
});
