// closure style module
(function() {
  var path = '/audio/',
      sounds = {
        zap01: path + 'zap01.wav',
        zap02: path + 'zap02.wav',
        zap03: path + 'zap03.wav',
        zap04: path + 'zap04.wav',
        zap05: path + 'zap05.wav',
        zap06: path + 'zap06.wav',
        zap07: path + 'zap07.wav',
        fail:  path + 'fail-trombone.mp3',
        kickstart: path + 'song_kickstart.mp3'
      }

  function make(src) {
    return new Audio(src); // creates an html5 audio element
  }

  var S = function() {
    return {
      play: function(src, vol) {
        var sound = make(sounds[src]);
        sound.play();

        if(vol > 0) { // uhhh, need better arg exists test
          sound.volume = vol;
        }
        console.log(sound);
      }
    }
  }();

  window.S = S; // make singleton
})();

