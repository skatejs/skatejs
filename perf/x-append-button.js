(function () {
  'use strict';

  function getButton (element) {
    return element.querySelector('button');
  }

  function getInput (element) {
    return element.querySelector('input');
  }

  skate('x-append-button', {
    ready: function (element) {
      element.setAttribute('size', getInput(element).value);
    },
    template: '<input type="text" value="10000"><button data-skate-content></button>',
    events: {
      'click button': function (element) {
        document.getElementById(element.getAttribute('to')).innerHTML = window.getTestElements(element.getAttribute('size'));
      },

      'input input': function (element, e) {
        element.setAttribute('size', e.target.value);
      }
    }
  });
}());
