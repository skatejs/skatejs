'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.define = define;

var _name = require('./name');

function define(Ctor) {
  customElements.define(Ctor.is || (0, _name.name)(), Ctor);
  return Ctor;
}
