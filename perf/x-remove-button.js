(function () {
  'use strict';

  skate('x-remove-button', {
    template: '<button data-skate-content></button>',
    events: {
      'click button': function (element, e) {
        document.getElementById(element.getAttribute('from')).innerHTML = '';
      }
    }
  });
}());
