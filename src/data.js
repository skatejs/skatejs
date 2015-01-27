'use strict';

import '../node_modules/weakmap/weakmap';

export default function (element) {
  var data = element.__SKATE_DATA;

  if (!data) {
    element.__SKATE_DATA = data = {};
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
