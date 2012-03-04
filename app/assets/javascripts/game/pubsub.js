function pubsubInit() {
  // Enable pusher logging - don't include this in production
  Pusher.log = function(message) {
    if (window.console && window.console.log) window.console.log(message);
  };

  // Flash fallback logging - don't include this in production
  WEB_SOCKET_DEBUG = true;

  var pusher = new Pusher('657713b267a64758afbf');
  var channel = pusher.subscribe('presence-mapgame_global');
  channel.bind('client-player_move', function(data) {
    if (data.user_id !== Game.user_id) {
      Game.otherPlayers[data.user_id] = {
        x: data.x,
        y: data.y
      };
    }
  });
  channel.bind('pusher:subscription_succeeded', function(data) {
    console.log("PUSHER - Subscribed to channel!");
    data.each(function(user) {
      if (!Game.otherPlayers[user.id]) {
        Game.otherPlayers[user.id] = {};
        Game.helpers.addOtherPlayer(user.id);
      }
    });
  });
  channel.bind('pusher_internal:member_added', function(data) {
    console.log("PUSHER - A member has been added!");
    console.dir(data);
  });
  channel.bind('pusher_internal:member_removed', function(data) {
    console.log("PUSHER - A member has been removed!");
    console.dir(data);
  });
  Game.pubsub = channel;
}
