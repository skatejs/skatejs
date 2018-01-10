'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.wrap = undefined;

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
  };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _skatejs = require('skatejs');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const withReact = (Base = HTMLElement) =>
  class extends Base {
    get props() {
      // We override props so that we can satisfy most use
      // cases for children by using a slot.
      return _extends({}, super.props, {
        children: _react2.default.createElement('slot', null)
      });
    }
    renderer(root, call) {
      (0, _reactDom.render)(call(), root);
    }
  };

exports.default = withReact;
const wrap = (exports.wrap = Component =>
  class extends withReact() {
    render() {
      return _react2.default.createElement(Component, this.props);
    }
  });
