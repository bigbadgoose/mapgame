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
      hp: 100
    });
    this.addComponent("Collision")
      .collision()
      .onHit("powerup", function() {
        console.log("Got a powerup!");
      })
      .onHit("waypoint", function(e) {
        S.play("zap01");
        FX.adviceAnimal('biteoff', 'psycho');
        console.log("Waypoint reached!");
        Game.waypoints.index++;
        var data = {
          index: Game.waypoints.index
        };
        spawnNextWaypoint(data);
        Game.pubsub.trigger("client-waypoint_reached", data);
      })
      .onHit("enemyBullet", function(e) {
        //Game.player.hp -= 2;
        if(Game.player.hp >= 0) {
          $('#score').html(Game.player.hp + "%");
        }
        console.log("OUCH", Game.player.hp);
        e[0].obj.destroy();
      });
  }
});

Crafty.c("otherPlayerComponent", {
  init: function() {
    this.attr({
      missing: 0
    });
    this.bind("EnterFrame", function() {
      if (Crafty.frame() % 2 == 0) {
        if (this.lat && this.lng) {
          var xy = Game.helpers.latLngtoXY([this.lat, this.lng]);
          this.x = xy[0]-16;
          this.y = xy[1]-12;
          this.z = xy[1]-12;
        } else {
          this.missing++;
          this.x = -50;
          this.y = -50;
          this.z = -50;
          if (this.missing > 10) {
            this.destroy();
            var player = Game.otherPlayers[this.user_id];
            if (player) {
              delete Game.otherPlayers[this.user_id];
            }
          }
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
      frame: 0,
      opacity: 1,
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
      if (this.frame > 180) {
        this.destroy();
      }
    });
    this.addComponent("Collision")
      .collision()
      .onHit("enemyDestroyingExplosion", function(e) {
        Crafty.e("2D, DOM, explosion, explosionSprite").attr({
          lat: this.lat,
          lng: this.lng,
          z: 900,
          w: 67,
          h: 174
        });
        this.destroy();
      });
  }
});


// Explosions
Crafty.c("enemyDestroyingExplosion", {
  init: function() {
    S.play("explosion");
    FX.adviceAnimal('pwned', 'psycho');
    this.attr({
      x: 0,
      y: 0,
      w: 960,
      h: 480,
      frame: 0
    });
    this.bind("EnterFrame", function() {
      this.frame++;
      if (this.frame > 5) {
        this.destroy();
      }
    });
  }
});


// Explosion sprites hack
Crafty.c("preExplosion0", {
  init: function() {
    this.attr({ frame: 0 });
    this.bind("EnterFrame", function() {
      this.x = Game.player.x - 30;
      this.y = Game.player.y;
      this.frame++;
      if (this.frame > 60) {
        this.destroy();
      }
    });
  }
});
Crafty.c("preExplosion1", {
  init: function() {
    this.attr({ frame: 0 });
    this.bind("EnterFrame", function() {
      this.x = Game.player.x;
      this.y = Game.player.y - 30;
      this.frame++;
      if (this.frame > 60) {
        this.destroy();
      }
    });
  }
});
Crafty.c("preExplosion2", {
  init: function() {
    this.attr({ frame: 0 });
    this.bind("EnterFrame", function() {
      this.x = Game.player.x;
      this.y = Game.player.y + 30;
      this.frame++;
      if (this.frame > 60) {
        this.destroy();
      }
    });
  }
});
Crafty.c("preExplosion3", {
  init: function() {
    this.attr({ frame: 0 });
    this.bind("EnterFrame", function() {
      this.x = Game.player.x + 30;
      this.y = Game.player.y;
      this.frame++;
      if (this.frame > 60) {
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

Crafty.c("explosion", {
  init: function() {
    this.attr({
      frame: 0
    });
    this.bind("EnterFrame", function() {
      if (Crafty.frame() % 2 == 0) {
        if (this.lat && this.lng) {
          var xy = Game.helpers.latLngtoXY([this.lat, this.lng]);
          this.x = xy[0]-20;
          this.y = xy[1]-48;
          this.z = xy[1]-48;
        }
      }
      this.frame++;
      if (this.frame > 45) {
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
