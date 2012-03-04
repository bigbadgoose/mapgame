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


  // Scenes
  Crafty.scene("game", function() {
    // Begin - game scene

    var player = Crafty
      .e("2D, DOM, playerSprite, Controls, Collision")
      .attr({
        xspeed: 3,
        yspeed: 3,
        x: 200,
        y: 200,
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
        if (Crafty.frame() % 10 == 0) {
          console.log("x:" + this.x + " - y: " + this.y);
          var mapBounds = map.getBounds();
          var offsetRatioX = (this.x-480)/480;
          var offsetRatioY = (this.y-300)/300;
          console.log("offsetX:" + offsetRatioX + " - offsetY:" + offsetRatioY);
          var lng = mapBounds.center.longitude;
          var lat = mapBounds.center.latitude;
          if (Math.abs(offsetRatioX) > 0.2) {
            lng += offsetRatioX*mapBounds.width/8;
          }
          if (Math.abs(offsetRatioY) > 0.2) {
            lat += -offsetRatioY*mapBounds.height/8;
          }
          map.setView({ center: new Microsoft.Maps.Location(lat,lng) });
        }
        if (Crafty.frame() % 60 == 0) {
          window.shit = Game.pubsub;
          Game.pubsub.trigger("client-player_move", {
            user_id: Game.user_id,
            x: this.x,
            y: this.y
          });
        }
        if (this.moving.left) {
          this.x -= this.xspeed;
        } else if (this.moving.right) {
          this.x += this.xspeed;
        }
        if (this.moving.up) {
          this.y -= this.yspeed;
        } else if (this.moving.down) {
          this.y += this.yspeed;
        }
        this.z = this.y;
      })
      .bind("KeyDown", function(e) {
        switch (e.keyCode) {
          case Crafty.keys.D: this.moving.right = true; this.moving.left = false; break;
          case Crafty.keys.A: this.moving.left = true; this.moving.right = false; break;
          case Crafty.keys.W: this.moving.up = true; this.moving.down = false; break;
          case Crafty.keys.S: this.moving.down = true; this.moving.up = false; break;
          case Crafty.keys.P: map.setView({center:new Microsoft.Maps.Location(37.794254, -122.419453)}); break;
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

