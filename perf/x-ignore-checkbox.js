(function () {
  'use strict';

  function getCheckbox (element) {
    return element.querySelector('input');
  }

  skate('x-ignore-checkbox', {
    template: '<label><input type="checkbox"> <span data-skate-content></span></label>',
    attributes: {
      checked: function (element, change) {
        getCheckbox(element).checked = change.newValue !== 'false';
      }
    },
    events: {
      'change input': function (element, e) {
        var dest = document.getElementById(element.getAttribute('in'));

        if (e.target.checked) {
          dest.setAttribute('data-skate-ignore', '');
        } else {
          dest.removeAttribute('data-skate-ignore');
        }
      }
    }
  });
}());
