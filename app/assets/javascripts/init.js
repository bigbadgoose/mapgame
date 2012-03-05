// Constants
const WIDTH = 960;
const HEIGHT = 600;

// Fix spacebar shit
window.onkeydown = function(e) {
  return !(e.keyCode == 32);
};

// Globals
var Game = {
  user_id: false,
  waypoint: false,
  waypointIndicator: false,
  waypointText: false,
  waypointCounts: 0,
  player: false,
  otherPlayers: {},
  messageCounters: {},
  entities: {
    player: false
  },
  waypoints: {
    list: [],
    index: 0,
    current: false
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
  }, 1000);

  if (!navigator.userAgent.match(/Chrome/)) {
    alert('game works best on chrome ... so please use that!');
  }

  // S.play('zap01');
  // S.play('zap02');
  // S.play('prepare');
  S.play('kickstart', .2);

  //FX.adviceAnimal('biteoff');

});
