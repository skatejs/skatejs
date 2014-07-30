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
    template: '<label><input type="checkbox"> <span data-skate-content></span></label>',
    ready: function (element) {
      element.setAttribute('checked', getTarget(element).hasAttribute(ATTR_IGNORE) ? 'true' : 'false');
    },
    attributes: {
      checked: function (element, change) {
        getCheckbox(element).checked = change.newValue !== 'false';
      }
    },
    events: {
      'change input': function (element, e) {
        var dest = getTarget(element);

        if (e.target.checked) {
          dest.setAttribute(ATTR_IGNORE, '');
        } else {
          dest.removeAttribute(ATTR_IGNORE);
        }
      }
    }
  });
}());
