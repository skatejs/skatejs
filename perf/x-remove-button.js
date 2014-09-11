(function () {
  'use strict';

  skate('x-remove-button', {
    template: function (element) {
      element.innerHTML = '<button data-skate-content></button>';
    },

    events: {
      'click button': function (element, e) {
        document.getElementById(element.getAttribute('from')).innerHTML = '';
      }
    }
  });
}());
