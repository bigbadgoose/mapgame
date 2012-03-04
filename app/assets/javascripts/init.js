// Constants
const WIDTH = 960;
const HEIGHT = 600;


// Globals
var Game = {
  user_id: false,
  waypoint: false,
  player: false,
  otherPlayers: {},
  entities: {
    player: false
  },
  helpers: {
    loadScene: false
  },
  pubsub: false
};
window.Game = Game;


// Docready
$(function() {
  B.init();
  M.init($('#messages'));
  setTimeout(function() {
    Game.helpers.loadScene("game");
  }, 500);

  S.play('zap01');
  S.play('zap02');
  S.play('zap03');
  //S.play('kickstart', .2);
});
