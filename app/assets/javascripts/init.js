// Constants

const WIDTH = 960;
const HEIGHT = 600;
const SPRITES = [
  "/images/sprites/player.gif",
  "/images/sprites/ghost.gif"
];


// Globals
var Game = {
  user_id: false,
  player: false,
  otherPlayers: {},
  entities: {
    player: false
  },
  helpers: {
    loadScene: false
  },
  pubsub: false
};
window.Game = Game;


// ---------------------------------------------- CONSOLE
var M = function() {
  return {
    stuff: {
      el: null,
      css: 'info'
    },
    init: function(ele) {
      var self = this;
      self.stuff.el = ele;
    },
    log: function(val, type) {
      this.append(val, type);
    },
    add: function(val, type) {
      this.append(val, type);
    },
    append: function(val, type) {
      var self = this,
          msg = $('<p>').
            addClass(type).
            html(val);
      self.stuff.el.append(msg);
    },
    clear: function(val) {
      M.stuff.el.empty();
    }
  }
}();


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

      Microsoft.Maps.loadModule('Microsoft.Maps.VenueMaps', {callback: self.venuemapsModuleLoaded});
      window.map = map;
    },

    reset: function() {
      map.setView({center: new Microsoft.Maps.Location(origin.lat, origin.long)});
      M.log('reset');
    },

    venuemapsModuleLoaded: function() {
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
       var displayResults = "Nearby venues with available venue maps:\n";
       for (var i=0; i<venues.length; i++) {
          displayResults = displayResults + venues[i].metadata.Name + "\t" + venues[i].distance/1000 + " km\n";
       }
       M.log('venues: ' + displayResults);
    }
  }
}();


// ---------------------------------------------- JQ INIT
$(function() {
  $('#messages').click(function() {
    $('#messages').addClass('on')
  });
  M.init($('#messages'));
});
