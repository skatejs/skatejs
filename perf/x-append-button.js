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
    template: '<input type="text"><button data-skate-content></button>',
    events: {
      'click button': function (element) {
        var create = element.getAttribute('create');
        var to = element.getAttribute('to');

        if (create && create !== 'false') {
          var container = document.createElement('div');
          container.id = to;
          document.body.appendChild(container);
        }

        document.getElementById(to).innerHTML = window.getTestElements(element.getAttribute('size'));
      },

      'input input': function (element, e) {
        element.setAttribute('size', e.target.value);
      }
    }
  });
}());
