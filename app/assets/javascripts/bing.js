// -------------------------------------------- BING MAPS
var B = function() {
  var origin = {lat:37.794254, long:-122.419453};

  return {
    center: {lat:37.794254, long:-122.419453},
    init: function() {
      var self = this,
          mapOpts = {
            credentials:"AlC9CGbZ8LHeSgdDZKuTJcKueNw6H-YgNcBLvFL5uzfittgGIKTucztKA8OI37Rc",
            center: new Microsoft.Maps.Location(this.center.lat, this.center.long),
            mapTypeId: Microsoft.Maps.MapTypeId.road,
            //labelOverlay: Microsoft.Maps.LabelOverlay.hidden,
            //disableBirdseye: true,
            showDashboard: false,
            width: 960,
            height: 600,
            zoom: 16
          },
          map = new Microsoft.Maps.Map(document.getElementById("map_div"), mapOpts);

      // export
      window.map = map;

      // venues
      Microsoft.Maps.loadModule('Microsoft.Maps.VenueMaps', {callback: self.venuemapsModuleLoaded});

      // waypoint
      self.putWaypoint();
    },

    putWaypoint: function() {
      var center = map.getCenter();
      /*
          pin = new Microsoft.Maps.Pushpin({latitude: origin.lat, longitude: origin.long}, {
            draggable: true,
            icon: '/images/sprites/waypoint_flag.gif',
            width: 36, height: 64
          });
          map.entities.push(pin);
      */
    },

    reset: function() {
      map.setView({center: new Microsoft.Maps.Location(origin.lat, origin.long)});
      // M.log('reset');
    },

    venuemapsModuleLoaded: function() {
      return false;

      var vmaps = new Microsoft.Maps.VenueMaps.VenueMapFactory(map),
          self = this;
      vmaps.getNearbyVenues({
        map: map,
        location: map.getCenter(),
        radius:10000,
        callback: B.showVenues
      });
    },

    showVenues: function(venues) {
      if (!venues) return; // sometimes caller fails, no success option
      var displayResults = "Nearby venues with available venue maps:\n";
      for (var i=0; i<venues.length; i++) {
        displayResults = displayResults + venues[i].metadata.Name + "\t" + venues[i].distance/1000 + " km\n";
        console.log('VENUE: ', venues[i]);
      }
      // M.log('venues: ' + displayResults);
    }
  }
}();


