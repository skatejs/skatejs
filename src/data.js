'use strict';

import '../node_modules/weakmap/weakmap';

var map = new WeakMap();

export default function (element) {
  var data = map.get(element);

  if (!data) {
    data = {};
    map.set(element, data);
  }

  return {
    get: function (name) {
      return data[name];
    },

    set: function (name, value) {
      data[name] = value;
      return this;
    }
  };
}
