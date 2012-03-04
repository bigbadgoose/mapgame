function pubsubInit() {
  // Enable pusher logging - don't include this in production
  Pusher.log = function(message) {
    // if (window.console && window.console.log) window.console.log(message);
  };

  // Flash fallback logging - don't include this in production
  WEB_SOCKET_DEBUG = true;

  var pusher = new Pusher('657713b267a64758afbf');
  var channel = pusher.subscribe('presence-mapgame_global');
  channel.bind('client-player_move', function(data) {
    if (data.user_id !== Game.user_id) {
      if (data.lat && data.lng) {
        var otherPlayer = Game.otherPlayers[data.user_id];
        if (otherPlayer) {
          Game.otherPlayers[data.user_id].lat = data.lat;
          Game.otherPlayers[data.user_id].lng = data.lng;
        } else {
          Game.otherPlayers[data.user_id] = {
            entity: Game.helpers.addOtherPlayer(data.user_id),
            lat: data.lat,
            lng: data.lng
          };
        }
      }
    }
  });
  channel.bind('client-spawn_enemy', function(data) {
    spawnGhost(data);
  });
  channel.bind('client-waypoint_reached', function(data) {
    spawnNextWaypoint(data.index);
  });

  channel.bind('pusher:subscription_succeeded', function(data) {
    // console.log("PUSHER - Subscribed to channel!");
    data.each(function(user) {
      if (user.id != Game.user_id && !Game.otherPlayers[user.id]) {
        Game.otherPlayers[user.id] = {
          entity: Game.helpers.addOtherPlayer(user.id)
        }
      }
    });
  });
  channel.bind('pusher_internal:member_added', function(data) {
    M.add("User:" + data.user_id + " has joined the game!");
    console.log("PUSHER - A member has been added!");
    Game.otherPlayers[data.user_id] = {
      entity: Game.helpers.addOtherPlayer(data.user_id)
    };
  });
  channel.bind('pusher_internal:member_removed', function(data) {
    console.log("PUSHER - A member has been removed!");
    var player = Game.otherPlayers[data.user_id];
    if (player && player.entity) {
      player.entity.destroy();
    }
    M.add("User:" + data.user_id + " has left the game!");
  });
  Game.pubsub = channel;
}
