(function () {
  'use strict';

  var ATTR_IGNORE = 'data-skate-ignore';

  function getCheckbox (element) {
    return element.querySelector('input');
  }

  function getTarget (element) {
    return document.getElementById(element.getAttribute('in'));
  }

  skate('x-ignore-checkbox', {
    attributes: {
      checked: function (element, change) {
        getCheckbox(element).checked = change.newValue !== 'false';
      }
    },

    events: {
      'change input': function (element, e) {
        var dest = getTarget(element);

        if (!dest) {
          return;
        }

        if (e.target.checked) {
          dest.setAttribute(ATTR_IGNORE, '');
        } else {
          dest.removeAttribute(ATTR_IGNORE);
        }
      }
    },

    ready: function (element) {
      var target = getTarget(element);

      if (target) {
        element.setAttribute('checked', target.hasAttribute(ATTR_IGNORE) ? 'true' : 'false');
      }
    },

    template: function (element) {
      element.innerHTML = '' +
        '<label>' +
          '<input type="checkbox"> ' +
          '<span>' + element.textContent + '</span>' +
        '</label>';
    }
  });
}());
