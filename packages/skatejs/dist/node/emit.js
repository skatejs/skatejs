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
  };

exports.emit = emit;

const defs = {
  bubbles: true,
  cancelable: true,
  composed: false
};

function emit(elem, name, opts) {
  const eventOptions = _extends({}, defs, opts);
  let e;
  if ('composed' in CustomEvent.prototype) {
    e = new CustomEvent(name, eventOptions);
  } else {
    e = document.createEvent('CustomEvent');
    e.initCustomEvent(
      name,
      eventOptions.bubbles,
      eventOptions.cancelable,
      eventOptions.detail
    );
    Object.defineProperty(e, 'composed', { value: eventOptions.composed });
  }
  return elem.dispatchEvent(e);
}
