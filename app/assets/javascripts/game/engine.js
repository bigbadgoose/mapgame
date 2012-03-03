const WIDTH = 600;
const HEIGHT = 400;

const SPRITES = [
  "/images/sprites/player.gif"
];

var Game = {
  entities: { 
    player: false
  },
  helpers: {
    loadScene: false
  }
};
window.Game = Game;

$(function() {
  Crafty.init(WIDTH, HEIGHT);

  Crafty.load(SPRITES, function() {
    console.log("Loading sprites!");
    Crafty.sprite(32, "/images/sprites/player.gif", { player: [0,0,1,1.5] });
  });

  // Scenes
  Crafty.scene("game", function() {
    // Begin - game scene

    console.log("New game start!");

    var player = Crafty
      .e("2D, DOM, player, Controls, Collision")
      .origin("center")
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

    // End - game scene
  });

  Game.helpers.loadScene = function(scene) {
    console.log("Loading scene! - " + scene);
    Crafty.scene(scene);
  };
});

