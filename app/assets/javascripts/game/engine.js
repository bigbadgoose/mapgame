
$(function() {
  pubsubInit();
  Crafty.init(WIDTH, HEIGHT);

  // Helper functions
  Game.helpers.loadScene = function(scene) {
    Crafty.scene(scene);
  };
  Game.helpers.addOtherPlayer = function(data) {
    var component = "2D, DOM, playerComponent, otherPlayerComponent";
    component += ", " + Game.helpers.getPlayerSprite(data.user_id);
    return Crafty.e(component).attr(data);
  };
  Game.helpers.allPlayerLocations = function() {
    var keys = _.keys(Game.otherPlayers);
    console.log(keys);
    _.each(keys, function(k) {
      console.log(k);
      var player = Game.otherPlayers[k];
      console.log("Player:" + k + " - x:" + player.x + ", y:" + player.y);
    });
  };
  Game.helpers.getPlayerLatLng = function() {
    var xOffset = (Game.player.x+32)-480,
        yOffset = (Game.player.y+32)-300;
    var mapBounds = map.getBounds();
    var lng = mapBounds.center.longitude+xOffset/480*mapBounds.width/2;
    var lat = mapBounds.center.latitude-yOffset/300*mapBounds.height/2;
    return {
      lat: lat,
      lng: lng
    }
  };
  Game.helpers.latLngtoXY = function(latLng) {
    var mapBounds = map.getBounds();
    var x = (latLng[1] - mapBounds.center.longitude)/mapBounds.width*960 - 16 + 480;
    var y = (mapBounds.center.latitude - latLng[0])/mapBounds.height*600 - 24 + 300;
    return [x,y];
  };
  Game.helpers.setMapCenter = function() {
    map.setView({ center: new Microsoft.Maps.Location(testLat,testLng) });
  };
  Game.helpers.spawnGhost = function() {
    var mapBounds = map.getBounds();
    var latLng = [
      mapBounds.center.latitude + mapBounds.height/5,
      mapBounds.center.longitude - mapBounds.width/5
    ];

    var data = {
      components: "2D, DOM, ghostSprite, ghostComponent",
      latLng: latLng,
      v: [Math.random()*2-1, Math.random()*2-1],
      bullets: (function() {
        var b = [];
        for (var i=0; i<20; ++i) {
          var x = Math.random()*3;
          var y = Math.random()*3;
          b.push([x,y]);
        }
        return b;
      })()
    };
    Game.pubsub.trigger("client-spawn_enemy", data);
    spawnGhost(data);
  };
  Game.helpers.spawnNextWaypoint = function() {
    Game.pubsub.trigger("client-waypoint_reached", {});
    spawnNextWaypoint();
  };
  Game.helpers.explodeEverything = function() {
    console.log("Exploding EVERYTHING!!!");
    Crafty.e("2D, DOM, enemyDestroyingExplosion");
  };
  Game.helpers.getPlayerSprite = function(str) {
    switch (str.charCodeAt(0) % 4) {
      case 0: return "playerSaucerSprite"; break;
      case 1: return "playerLakituSprite"; break;
      case 2: return "playerMushboomSprite"; break;
      case 3: return "playerKirbySprite"; break;
    }
    return "playerLakituSprite";
  };

  // Scenes
  Crafty.scene("game", function() {
    // Begin - game scene

    setTimeout(function() {
      var keys = _.keys(Game.otherPlayers);
      _.each(keys, function(k) {
        var player = Game.otherPlayers[k];
        if (player) {
          player.destroy();
          delete Game.otherPlayers[k];
        }
      });
    }, 500);

    var waypointIndicator = Crafty.e("2D, DOM, arrow, arrowSprite");
    Game.waypointIndicator = waypointIndicator;

    var sprite = Game.helpers.getPlayerSprite(Game.user_id);
    var player = Crafty
      .e("2D, DOM, playerComponent, Controls, Collision, " + sprite)
      .attr({
        xspeed: 3,
        yspeed: 3,
        x: 480-16,
        y: 300-24,
        z: 300-24,
        moving: {
          left: false,
          right: false,
          up: false,
          down: false
        },
        firing: {
          left: false,
          right: false,
          up: false,
          down: false
        }
      })
      .bind("EnterFrame", function() {
        var frame = Crafty.frame();

        // Send location updates to server for persistence and other clients
        if (frame % 10 == 0) {
          var latLng = Game.helpers.getPlayerLatLng();
          if (frame % 60 == 0) {
            $.ajax({
              url: "/positions",
              type: "POST",
              data: {
                lat: latLng.lat,
                lng: latLng.lng
              }
            });
          }
          Game.pubsub.trigger("client-player_move", {
            user_id: Game.user_id,
            lat: latLng.lat,
            lng: latLng.lng
          });
        }

        if (frame % 10 == 0) {
          if (this.moving.left || this.moving.right || this.moving.up || this.moving.down) {
            var mapBounds = map.getBounds();
            var offsetRatioX = (this.x+16-480)/480;
            var offsetRatioY = -(this.y+24-300)/300;
            var lng = mapBounds.center.longitude;
            var lat = mapBounds.center.latitude;
            var xOff = 0, yOff = 0;
            if ((this.moving.left && offsetRatioX < -0.15) || (this.moving.right && offsetRatioX > 0.15)) {
              xOff = offsetRatioX;
            }
            if ((this.moving.up && offsetRatioY > 0.15) || (this.moving.down && offsetRatioY < -0.15)) {
              yOff = offsetRatioY;
            }
            lng += xOff*mapBounds.width/6;
            lat += yOff*mapBounds.height/6;
            map.setView({ center: new Microsoft.Maps.Location(lat,lng) });
          }
        }

        // Handle firing of bullets and directions
        if (frame % 30 == 0) {
          if (this.firing.left || this.firing.right || this.firing.up || this.firing.down) {
            var x = 0, y = 0;
            if (this.firing.left) {
              x = -5;
            } else if (this.firing.right) {
              x = 5;
            }
            if (this.firing.up) {
              y = -5;
            } else if (this.firing.down) {
              y = 5;
            }
            Crafty.e("2D, DOM, Color, bullet, playerBullet").color("blue").attr({
              lat: latLng.lat,
              lng: latLng.lng,
              w: 6,
              h: 6,
              latSpeed: -0.00005*y,
              lngSpeed: 0.00005*x
            });
          }
        }

        // Handle moving within a boundary within field of view
        var xOffset = this.x+16-480;
        var yOffset = this.y+24-300;

        if (this.moving.left) {
          if (xOffset > -150) {
            this.x -= this.xspeed;
          }
        } else if (this.moving.right) {
          if (xOffset < 150) {
            this.x += this.xspeed;
          }
        }
        if (this.moving.up) {
          if (yOffset > -150) {
            this.y -= this.yspeed;
          }
        } else if (this.moving.down) {
          if (yOffset < 150) {
            this.y += this.yspeed;
          }
        }
        this.z = this.y;
      })
      .bind("KeyDown", function(e) {
        switch (e.keyCode) {
          case Crafty.keys.D: this.moving.right = true; this.moving.left = false; break;
          case Crafty.keys.A: this.moving.left = true; this.moving.right = false; break;
          case Crafty.keys.W: this.moving.up = true; this.moving.down = false; break;
          case Crafty.keys.S: this.moving.down = true; this.moving.up = false; break;
          case Crafty.keys.SPACE: break;

          case Crafty.keys.J: this.firing.left = true; this.firing.right = false; break;
          case Crafty.keys.L: this.firing.right = true; this.firing.left = false; break;
          case Crafty.keys.I: this.firing.up = true; this.firing.down = false; break;
          case Crafty.keys.K: this.firing.down = true; this.firing.up = false; break;

          case Crafty.keys.T: FX.adviceAnimal('biteoff', 'calm'); break;
          case Crafty.keys.R: FX.adviceAnimal('pwned', 'calm'); break;
          case Crafty.keys.E: FX.adviceAnimal('umadd', 'psycho'); break;

          case Crafty.keys.P: B.reset(); break;
          case Crafty.keys.B: Game.helpers.explodeEverything(); break;
          case Crafty.keys.H: Game.helpers.spawnNextWaypoint(); break;
          case Crafty.keys.G: Game.helpers.spawnGhost(); break;
        }
      })
      .bind("KeyUp", function(e) {
        switch (e.keyCode) {
          case Crafty.keys.D: this.moving.right = false; break;
          case Crafty.keys.A: this.moving.left = false; break;
          case Crafty.keys.W: this.moving.up = false; break;
          case Crafty.keys.S: this.moving.down = false; break;
          case Crafty.keys.SPACE: break;

          case Crafty.keys.J: this.firing.left = false; break;
          case Crafty.keys.L: this.firing.right = false; break;
          case Crafty.keys.I: this.firing.up = false; break;
          case Crafty.keys.K: this.firing.down = false; break;
        }
      })
    Game.player = player;

    // End - game scene
  });

});

