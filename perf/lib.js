(function () {
  'use strict';

  var exports = window.perf = {};

  function insertHandler (element) {
    element.textContent += ', done!';
  }

  exports.getTestElements = function (size) {
    var html = '';
    size = size || 1;

    for (var a = 0; a < size; a++) {
      var num = a + 1;
      html += '<div><div><article><section><div><ul><li><a href="#"><span><skate-test-' + num + '>Test ' + num + '</skate-test-' + num + '></span></a></li></ul></div></section></article></div></div>';
    }

    return html;
  };

  exports.addTestElements = function (container, amount) {
    container.innerHTML = exports.getTestElements(amount);
  };

  exports.addSkateListeners = function (amount, prefix) {
    for (var a = 0; a < amount; a++) {
      prefix = prefix || 'skate-test-';

      skate(prefix + (a + 1), {
        insert: insertHandler
      });
    }
  };
}());
