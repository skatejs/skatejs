'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  }; /** @jsx h */

var _preact = require('preact');

exports.default = (Base = HTMLElement) =>
  class extends Base {
    get props() {
      // We override props so that we can satisfy most use
      // cases for children by using a slot.
      return _extends({}, super.props, {
        children: (0, _preact.h)('slot', null)
      });
    }
    renderer(root, call) {
      this._preactDom = (0, _preact.render)(
        call(),
        root,
        this._preactDom || root.children[0]
      );
    }
  };
