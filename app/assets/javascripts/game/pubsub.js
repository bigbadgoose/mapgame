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
    if (Crafty._current == "game" && data.user_id !== Game.user_id && data.lat && data.lng) {
      var otherPlayer = Game.otherPlayers[data.user_id];
      if (otherPlayer) {
        // console.log("Player:" + data.user_id + " - lat:" + data.lat + ", lng:" + data.lng);
        Game.otherPlayers[data.user_id].lat = data.lat;
        Game.otherPlayers[data.user_id].lng = data.lng;
      } else {
        // console.log("Creating non-existent: " + data.user_id);
        Game.otherPlayers[data.user_id] = Game.helpers.addOtherPlayer(data);
      }
    }
  });
  channel.bind('client-spawn_enemy', function(data) {
    spawnGhost(data);
  });
  channel.bind('client-waypoint_reached', function(data) {
    spawnNextWaypoint(false, data);
  });
  channel.bind('client-explode_everything', function(data) {
    spawnExplodeEverything();
  });

  channel.bind("server_game_event", function(data) {
    if (data.type == 'spawn') {
      // console.log("Spawn command received!");
      Game.helpers.spawnGhost();
    } else {
      // console.log("Event received!!!");
      // console.dir(data);
    }
  });

  channel.bind('pusher:subscription_succeeded', function(data) {
  });

  channel.bind('pusher_internal:member_added', function(data) {
    M.add("Player n00b " + data.user_id.substring(0,5) + " has entered the arena");
    var player = Game.otherPlayers[data.user_id];
    if (player) {
      player.destroy();
      delete Game.otherPlayers[data.user_id];
    }
    Game.otherPlayers[data.user_id] = Game.helpers.addOtherPlayer(data);
  });
  channel.bind('pusher_internal:member_removed', function(data) {
    M.add("Player " + data.user_id.substring(0,5) + " could not hang and peaced out of the game");
    var player = Game.otherPlayers[data.user_id];
    if (player) {
      player.destroy();
      delete Game.otherPlayers[data.user_id];
    }
  });
  Game.pubsub = channel;
}
