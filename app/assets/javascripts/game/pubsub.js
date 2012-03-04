console.log("Updated GAME: ---");
console.dir(Game);

$(function() {

  // Enable pusher logging - don't include this in production
  Pusher.log = function(message) {
    if (window.console && window.console.log) window.console.log(message);
  };

  // Flash fallback logging - don't include this in production
  WEB_SOCKET_DEBUG = true;

    console.log("Updated GAME 2: ---");
    console.dir(Game);

  var pusher = new Pusher('657713b267a64758afbf');
  var channel = pusher.subscribe('presence-mapgame_global');
  channel.bind('client-player_move', function(data) {
    if (data.user_id !== Game.user_id) {
      console.log("Got player move!");
    } else {
      console.log("Got own move!");
    }
  });
  channel.bind('pusher:subscription_succeeded', function(data) {
    console.log("PUSHER - Subscribed to channel!");
    console.dir(data);
    data.each(function(user) {
      console.log("ID:" + user.id);
      Game.otherPlayers[user.id] = {};
    });
  });
  channel.bind('pusher_internal:member_added', function(data) {
    console.log("PUSHER - A member has been added!");
  });
  channel.bind('pusher_internal:member_removed', function(data) {
    console.log("PUSHER - A member has been removed!");
  });
  Game.pubsub = channel;

});
