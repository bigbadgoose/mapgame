function spawnGhost(data) {
  console.log("Ghost spawn!!!");
  Crafty.e(data.components).attr({
    lat: data.latLng[0],
    lng: data.latLng[1],
    latSpeed: -0.00002*data.v[0],
    lngSpeed: 0.00002*data.v[1],
    bullets: data.bullets
  });
}
