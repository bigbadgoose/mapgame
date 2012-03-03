const WIDTH = 800;
const HEIGHT = 600;

var Game = {
  player: false
};
window.Game = Game;

$(function() {
  Crafty.init(WIDTH, HEIGHT);

  var player = Crafty
    .e("2D")
    .origin("center")
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
