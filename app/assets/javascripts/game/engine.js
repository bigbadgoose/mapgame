const WIDTH = 800;
const HEIGHT = 600;

const SPRITES = [
  "/assets/sprites/player.gif"
];

var Game = {
  player: false
};
window.Game = Game;

$(function() {
  Crafty.init(WIDTH, HEIGHT);

  Crafty.load(SPRITES, function() {
    Crafty.sprite(32, "/assets/sprites/player.gif", { player: [0,0,1,1] });
  });

  var player = Crafty
    .e("2D, player")
    .origin("center")
    .bind("EnterFrame", function() {
      this.x = 500;
      this.y = 400;
    })
    .bind("KeyDown", function(e) {
      switch (e.keyCode) {
        case Crafty.keys.D:
          console.log("Pressed d");
          break;
        case Crafty.keys.A:
          console.log("Pressed a");
          break;
        case Crafty.keys.W:
          console.log("Pressed w");
          break;
        case Crafty.keys.S:
          console.log("Pressed s");
          break;
      }
    });
  Game.player = player;
});
