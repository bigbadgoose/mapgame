// Player character component
Crafty.c("playerComponent", {
  init: function() {
    this.origin("center");
    this.attr({
      xspeed: 3,
      yspeed: 3,
      x: 30,
      y: 30,
    });
    this.addComponent("Collision")
      .collision()
      .onHit("powerup", function() {
        console.log("Got a powerup!");
      })
      .onHit("waypoint", function() {
        console.log("Waypoint reached!");
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


  }
});

