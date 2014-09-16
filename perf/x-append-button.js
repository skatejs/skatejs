(function () {
  'use strict';

  function getButton (element) {
    return element.querySelector('button');
  }

  function getInput (element) {
    return element.querySelector('input');
  }

  skate('x-append-button', {
    attributes: {
      value: function (element, change) {
        getInput(element).value = change.newValue;
      }
    },

    events: {
      'click button': function (element) {
        var create = element.getAttribute('create');
        var to = element.getAttribute('to');

        if (create && create !== 'false') {
          var container = document.createElement('div');
          container.id = to;
          document.body.appendChild(container);
        }

        document.getElementById(to).innerHTML = perf.getTestElements(element.getAttribute('value'));
      },

      'input input': function (element, e) {
        element.setAttribute('value', e.target.value);
      }
    },

    template: function (element) {
      element.innerHTML = '<input type="text" size="6"><button>' + element.textContent + '</button>';
    }
  });
}());
