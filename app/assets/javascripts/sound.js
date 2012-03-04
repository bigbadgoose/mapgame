// closure style module
(function() {
  var path = '/audio/',
      sounds = {
        zap01: path + 'zap01.wav',
        zap02: path + 'zap02.wav',
        zap03: path + 'zap03.wav'
      }

  function make(file) {
    return new Audio(file);
  }

  var S = function() {
    return {
      play: function(file) {
        var sound = make(sounds[file]);
        sound.play()
      }
    }
  }();

  window.S = S; // make singleton
})();

