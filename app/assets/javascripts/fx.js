(function() {
  var opts = {
      },
      screenBusy = false;


  var FX = function() {
    return {
      adviceAnimal: function(advice, flash) {

        if(screenBusy) return;
        if(!flash) flash = 'psycho';
        screenBusy = true;

        var animal$ = $('<div class="sprite animal">'),
            map$ = $('#map_div'),
            overlay$ = $('#overlay');

        // flash background
        map$.addClass(flash + ' fast flash');
        var interval = setInterval(function() {
          map$.toggleClass('fast flash');
        }, 200);

        // append
        map$.append(animal$);
        window.setTimeout(function() {
          map$.addClass(advice);
        }, 200);

        // add close message

        // dismiss
        setTimeout(function() {
          clearInterval(interval);
          map$.removeClass();
          animal$.fadeOut(500, function() {
            animal$.remove();
          });
          screenBusy = false;
        }, 3000);
      }
    }
  }();


  window.FX = FX; // make singleton later
})();
