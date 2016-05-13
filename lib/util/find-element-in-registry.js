(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', '../native/custom-elements'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('../native/custom-elements'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.customElements);
    global.findElementInRegistry = mod.exports;
  }
})(this, function (module, exports, _customElements) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (elem) {
    var tagName = elem.tagName;

    if (!tagName) {
      return;
    }

    var tagNameLc = tagName.toLowerCase();
    var tagNameDefinition = _customElements2.default.get(tagNameLc);

    if (tagNameDefinition) {
      return tagNameDefinition;
    }

    var isAttribute = elem.getAttribute('is');
    var isAttributeDefinition = _customElements2.default.get(isAttribute);

    if (isAttributeDefinition && isAttributeDefinition.extends === tagNameLc) {
      return isAttributeDefinition;
    }
  };

  var _customElements2 = _interopRequireDefault(_customElements);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  module.exports = exports['default'];
});