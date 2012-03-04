$(function() {
  Crafty.init(WIDTH, HEIGHT);

  Crafty.load(SPRITES, function() {
    Crafty.sprite(32, "/images/sprites/player.gif", { playerSprite: [0,0,1,1.5] });
  });

  // Player character component
  Crafty.c("playerComponent", {
    init: function() {
      this.origin("center");
      this.attr({
        xspeed: 3,
        yspeed: 3,
        x: 200,
        y: 200,
        w: 32,
        h: 48
      });
      this.bind("EnterFrame", function() {
        if (Crafty.frame() % 5 == 0) {
          var data = Game.otherPlayers[this.player_id];
          if (data.x && data.y) {
            this.x = data.x;
            this.y = data.y;
            this.z = data.y
          }
        }
      });
    }
  });

  // Helper functions
  Game.helpers.loadScene = function(scene) {
    Crafty.scene(scene);
  };
  Game.helpers.addOtherPlayer = function(player_id) {
    Crafty.e("2D, DOM, playerComponent, playerSprite").attr({ player_id: player_id });
  };
  Game.helpers.updateOtherPlayer = function(player_id, data) {

  };
  Game.helpers.getPlayerLatLng = function() {
    var xOffset = (Game.player.x-16)-480,
        yOffset = (Game.player.y-24)-300;
    var mapBounds = map.getBounds();
    var lng = mapBounds.center.longitude+xOffset/480*mapBounds.width/2;
    var lat = mapBounds.center.latitude+yOffset/300*mapBounds.height/2;
    window.testLat = lat;
    window.testLng = lng;
    M.log("lat:" + lat + " - lng:" + lng);
    // console.log("lat:" + lat + " - lng:" + lng);
    return {
      lat: lat,
      lng: lng
    }
  };
  Game.helpers.setMapCenter = function() {
    map.setView({ center: new Microsoft.Maps.Location(testLat,testLng) });
  }

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
        w: 32,
        h: 48,
        moving: {
          left: false,
          right: false,
          up: false,
          down: false
        }
      })
      .bind("EnterFrame", function() {
        if (Crafty.frame() % 120 == 0) {
          Game.helpers.getPlayerLatLng();
        }
        if (Crafty.frame() % 60 == 0) {
          var offsetRatioX = (this.x+16-480)/480;
          var offsetRatioY = -(this.y+24-300)/300;
          // console.log("offsetX:" + offsetRatioX + " - offsetY:" + offsetRatioY);
        }
        if (Crafty.frame() % 10 == 0) {
          if (this.moving.left || this.moving.right || this.moving.up || this.moving.down) {
            // console.log("x:" + this.x + " - y: " + this.y);
            var mapBounds = map.getBounds();
            var offsetRatioX = (this.x+16-480)/480;
            var offsetRatioY = -(this.y+24-300)/300;
            //console.log("offsetX:" + offsetRatioX + " - offsetY:" + offsetRatioY);
            var lng = mapBounds.center.longitude;
            var lat = mapBounds.center.latitude;
            if (this.moving.left && offsetRatioX < -0.15) {
              lng += offsetRatioX*mapBounds.width/6;
            } else if (this.moving.right && offsetRatioX > 0.15) {
              lng += offsetRatioX*mapBounds.width/6;
            }
            if (this.moving.up && offsetRatioY > 0.15) {
              lat += offsetRatioY*mapBounds.height/6;
            } else if (this.moving.down && offsetRatioY < -0.15) {
              lat += offsetRatioY*mapBounds.height/6;
            }
            map.setView({ center: new Microsoft.Maps.Location(lat,lng) });
          }
        }

        // Send location update to server for persistence
        if (Crafty.frame() % 60 == 0) {
          var latLng = Game.helpers.getPlayerLatLng();
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
        if (Crafty.frame() % 5 == 0) {
          window.shit = Game.pubsub;
          Game.pubsub.trigger("client-player_move", {
            user_id: Game.user_id,
            x: this.x,
            y: this.y
          });
        }
        xOffset = this.x+16-480;
        yOffset = this.y+24-300;

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
          //case Crafty.keys.P: map.setView({center:new Microsoft.Maps.Location(37.794254, -122.419453)}); break;
          case Crafty.keys.P: B.reset(); break;
        }
      })
      .bind("KeyUp", function(e) {
        switch (e.keyCode) {
          case Crafty.keys.D: this.moving.right = false; break;
          case Crafty.keys.A: this.moving.left = false; break;
          case Crafty.keys.W: this.moving.up = false; break;
          case Crafty.keys.S: this.moving.down = false; break;
        }
      });
    Game.player = player;
    pubsubInit();

    // End - game scene
  });

});

