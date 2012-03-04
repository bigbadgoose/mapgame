$(function() {
  Crafty.init(WIDTH, HEIGHT);

  const SPRITES = [
    // players
    "/images/sprites/player.gif",
    "/images/sprites/lakitu.gif",
    "/images/sprites/tala.gif",
    "/images/sprites/saucer.gif",
    "/images/sprites/librarian.gif",
    "/images/sprites/mushboom.gif",
    "/images/sprites/kirby_right.gif",
    // enemies
    "/images/sprites/ghost.gif",
    "/images/sprites/ghost_small.gif",
    "/images/sprites/zombie.gif",
    "/images/sprites/beholder.gif",
    "/images/sprites/roc.gif",
    "/images/sprites/bat.gif",
    "/images/sprites/firebrand.gif"
  ];
  Crafty.load(SPRITES, function() {
    Crafty.sprite(64, "/images/sprites/saucer.gif", { playerSprite: [0,0,1,1.5] });
    Crafty.sprite(64, "/images/sprites/bat.gif", { ghostSprite: [0,0,1,1.5] });
  });

  // Helper functions
  Game.helpers.loadScene = function(scene) {
    Crafty.scene(scene);
  };
  Game.helpers.addOtherPlayer = function(player_id) {
    return Crafty.e("2D, DOM, playerComponent, otherPlayerComponent, playerSprite").attr({
      player_id: player_id
    });
  };
  Game.helpers.allPlayerLocations = function() {
    _.each(_.keys(Game.otherPlayers), function(k) {
    });
  };
  Game.helpers.getPlayerLatLng = function() {
    var xOffset = (Game.player.x+16)-480,
        yOffset = (Game.player.y+24)-300;
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

  // Scenes
  Crafty.scene("game", function() {
    // Begin - game scene

    var player = Crafty
      .e("2D, DOM, playerSprite, Controls, Collision")
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
        }
      })
      .bind("EnterFrame", function() {
        if (Crafty.frame() % 10 == 0) {
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

        if (Crafty.frame() % 5 == 0) {
          var latLng = Game.helpers.getPlayerLatLng();

          // Send location update to server for persistence
          if (Crafty.frame() % 60 == 0) {
            $.ajax({
              url: "/positions",
              type: "POST",
              data: {
                lat: latLng.lat,
                lng: latLng.lng
              }
            });
          }

          // Send location updates to all other connected clients
          Game.pubsub.trigger("client-player_move", {
            user_id: Game.user_id,
            lat: latLng.lat,
            lng: latLng.lng
          });
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

          case Crafty.keys.P: B.reset(); break;
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
        }
      })
    Game.player = player;
    pubsubInit();

    // End - game scene
  });

});

