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
      ele.click(function() {
        ele.addClass('on')
      });
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
