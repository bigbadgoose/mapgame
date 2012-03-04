// Player character component
Crafty.c("playerComponent", {
  init: function() {
    this.origin("center");
    this.attr({
      xspeed: 3,
      yspeed: 3,
      x: 200,
      y: 200,
      w: 32,
      h: 48
    });
    this.bind("EnterFrame", function() {
      if (Crafty.frame() % 2 == 0) {
        var data = Game.otherPlayers[this.player_id];
        if (data.lat && data.lng) {
          var xy = Game.helpers.latLngtoXY([data.lat, data.lng]);
          this.x = xy[0];
          this.y = xy[1];
          this.z = xy[1];
        }
      }
    });
  }
});

Crafty.c("ghostComponent", {
  init: function() {
    this.origin("center");
    this.attr({
      xspeed: 2,
      yspeed: 2,
      x: 200,
      y: 200,
      w: 32,
      h: 48
    });
    this.bind("EnterFrame", function() {
      this.x += this.xspeed;
      this.y += this.xspeed;
    });
  }
});
