(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../util/data', '../global/registry'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../util/data'), require('../global/registry'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.data, global.registry);
    global.ready = mod.exports;
  }
})(this, function (exports, _data, _registry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (elements, callback) {
    var collection = elements.length === undefined ? [elements] : elements;
    var collectionLength = collection.length;
    var readyCount = 0;

    function callbackIfReady() {
      if (readyCount === collectionLength) {
        callback(elements);
      }
    }

    for (var a = 0; a < collectionLength; a++) {
      var elem = collection[a];

      if (ready(elem)) {
        ++readyCount;
      } else {
        // skate.ready is only fired if the element has not been initialised yet.
        elem.addEventListener('skate.ready', function () {
          ++readyCount;
          callbackIfReady();
        });
      }
    }

    // If the elements are all ready by this time that means nothing was ever
    // bound to skate.ready above.
    callbackIfReady();
  };

  var _data2 = _interopRequireDefault(_data);

  var _registry2 = _interopRequireDefault(_registry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function ready(element) {
    var components = _registry2.default.find(element);

    var componentsLength = components.length;

    for (var a = 0; a < componentsLength; a++) {
      if (!(0, _data2.default)(element, 'lifecycle/' + components[a].id).created) {
        return false;
      }
    }

    return true;
  }
});