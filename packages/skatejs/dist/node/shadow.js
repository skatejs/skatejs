'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.shadow = shadow;
function shadow(elem) {
  return (
    elem._shadowRoot ||
    (elem._shadowRoot = elem.shadowRoot || elem.attachShadow({ mode: 'open' }))
  );
}
