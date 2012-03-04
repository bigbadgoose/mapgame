const SPRITES = [
  // players
  "/images/sprites/player.gif",
  "/images/sprites/lakitu.gif",
  "/images/sprites/tala.gif",
  "/images/sprites/saucer.gif",
  "/images/sprites/librarian.gif",
  "/images/sprites/mushboom.gif",
  "/images/sprites/kirby_right.gif",

  // enemies
  "/images/sprites/ghost.gif",
  "/images/sprites/ghost_small.gif",
  "/images/sprites/zombie.gif",
  "/images/sprites/beholder.gif",
  "/images/sprites/diablos.gif",
  "/images/sprites/roc.gif",
  "/images/sprites/bat.gif",
  "/images/sprites/bat_mad.gif",
  "/images/sprites/firebrand.gif",

  // effects
  "/images/sprites/fx_explosion.gif",
  "/images/sprites/fx_bomb.gif",

  // misc
  "/images/sprites/waypoint_flag.gif",
  "/images/sprites/arrow.png"
];

Crafty.load(SPRITES, function() {
  Crafty.sprite(64, "/images/sprites/saucer.gif", { playerSaucerSprite: [0,0,1,1.5] });
  Crafty.sprite(64, "/images/sprites/lakitu.gif", { playerLakituSprite: [0,0,1,1.5] });
  Crafty.sprite(64, "/images/sprites/mushboom.gif", { playerMushboomSprite: [0,0,1,1.5] });
  Crafty.sprite(64, "/images/sprites/kirby_right.gif", { playerKirbySprite: [0,0,1,1.5] });

  Crafty.sprite(64, "/images/sprites/bat_mad.gif", { ghostSprite: [0,0,1,1.5] });
  Crafty.sprite(67, "/images/sprites/fx_explosion.gif", { explosionSprite: [0,0,1,2.6] });
  Crafty.sprite(32, "/images/sprites/waypoint_flag.gif", { waypointSprite: [0,0,1,2] });
  Crafty.sprite(34, "/images/sprites/arrow.png", { arrowSprite: [0,0,1,1] });
});

