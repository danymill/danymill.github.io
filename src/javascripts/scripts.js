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

  /**
   * Skills
   */
  var skills = (function(window, undefined) {

    /**
     * Enum of CSS selectors.
     */
    var SELECTORS = {
      skill: '.skills__item',
      skillPopup: '.skills__item_popup',
      skillLevel: '.skill-level',
      skillInfo: '.skill-info',
      skillContainer: '.skills__item-container'
    };

    /**
     * Enum of CSS classes.
     */
    var CLASSES = {
      skillActive: 'skills__item-container_active',
      skillClosed: 'skills__item-container_closed',
      skillClose: 'skill-close',
      skillContainer: 'skills__item-container',
      skillPopup: 'skills__item_popup'
    };

    /**
     * Initialise skills.
     */
    function init() {
      _bindSkills();
    }

    function _isOpen(elem) {
      return $(elem).find(SELECTORS.skillContainer).hasClass(CLASSES.skillActive);
    }

    /**
     * Bind Card elements.
     * @private
     */
    function _bindSkills() {
      var elements = $(SELECTORS.skill);
      $.each(elements, function(i, elem) {
        var skill = $(elem);
        if(skill.hasClass(CLASSES.skillPopup)) {
          skill.on('click', _playSkill.bind(skill));
        }
      });
    }

    /**
     * Open or close skill-info.
     * @param {Event} e The event object.
     * @private
     */
    function _playSkill(e) {
      var skill = $(this);
      var isOpen = _isOpen(skill);
      var target = $(e.target);
      if (isOpen && (target.hasClass(CLASSES.skillClose) || target.hasClass(CLASSES.skillContainer))) {
        skill.find(SELECTORS.skillContainer)
          .removeClass(CLASSES.skillActive)
          .addClass(CLASSES.skillClosed);
      }
      else if (!isOpen) {
        skill.find(SELECTORS.skillContainer)
          .addClass(CLASSES.skillActive)
          .removeClass(CLASSES.skillClosed);
      }
    }

    // Expose methods.
    return {
      init: init
    };
  })(window);

  $(document).ready(skills.init);
}));