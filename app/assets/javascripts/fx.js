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
        setTimeout(function() {
          map$.addClass(advice);
        }, 200);

        // add close message

        // dismiss
        var dismissTime = (advice == "umadd") ? 5000 : 2000;
        setTimeout(function() {
          clearInterval(interval);
          map$.removeClass();
          animal$.fadeOut(500, function() {
            animal$.remove();
          });
          screenBusy = false;
        }, dismissTime);
      }
    }
  }();


  window.FX = FX; // make singleton later
})();
