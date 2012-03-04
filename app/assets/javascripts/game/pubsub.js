$(function() {

  // Enable pusher logging - don't include this in production
  Pusher.log = function(message) {
    if (window.console && window.console.log) window.console.log(message);
  };

  // Flash fallback logging - don't include this in production
  WEB_SOCKET_DEBUG = true;

  var pusher = new Pusher('657713b267a64758afbf');
  var channel = pusher.subscribe('presence-mapgame_global');
  channel.bind('client-player_move', function(data) {
    console.log("Got player move! - " + data.x + ":" + data.y);
  });
  Game.pubsub = channel;

});
