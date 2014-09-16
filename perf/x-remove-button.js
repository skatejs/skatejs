(function () {
  'use strict';

  skate('x-remove-button', {
    events: {
      'click button': function (element, e) {
        document.getElementById(element.getAttribute('from')).innerHTML = '';
      }
    },

    template: function (element) {
      element.innerHTML = '<button>' + element.textContent + '</button>';
    }
  });
}());
