;(function(factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports !== 'undefined') {
    module.exports = factory(require('jquery'));
  } else {
    factory(jQuery);
  }

}(function($) {
  'use strict';

   $(document).ready(function() {
    $('.skill-level__bar').each(function() {
      var elem = $(this);
      var val = parseInt(elem.closest('.skill-level').data('percent'));
      if (isNaN(val)) { val = 50;}
      var r = elem.attr('r');
      var c = Math.PI*(r*2);
      var pct = ((100-val)/100)*c;
      elem.css({ strokeDasharray: c});
      elem.css({ strokeDashoffset: pct});
    });
  });
}));