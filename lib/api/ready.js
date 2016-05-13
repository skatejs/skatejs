(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', '../util/data', '../util/find-element-in-registry'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('../util/data'), require('../util/find-element-in-registry'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.data, global.findElementInRegistry);
    global.ready = mod.exports;
  }
})(this, function (module, exports, _data, _findElementInRegistry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (elements, callback) {
    var collection = elements.length === undefined ? [elements] : elements;
    var collectionLength = collection.length;
    var readyCount = 0;

    function callbackIfReady() {
      ++readyCount;
      if (readyCount === collectionLength) {
        callback(elements);
      }
    }

    for (var a = 0; a < collectionLength; a++) {
      var elem = collection[a];

      if (ready(elem)) {
        callbackIfReady();
      } else {
        var info = (0, _data2.default)(elem);
        if (info.readyCallbacks) {
          info.readyCallbacks.push(callbackIfReady);
        } else {
          info.readyCallbacks = [callbackIfReady];
        }
      }
    }
  };

  var _data2 = _interopRequireDefault(_data);

  var _findElementInRegistry2 = _interopRequireDefault(_findElementInRegistry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function ready(element) {
    var component = (0, _findElementInRegistry2.default)(element);
    return component && (0, _data2.default)(element).created;
  }

  module.exports = exports['default'];
});