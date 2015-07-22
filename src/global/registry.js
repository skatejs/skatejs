import apiEmit from '../api/emit';
import globals from './vars';
import hasOwn from '../util/has-own';
import typeElement from '../type/element';

var definitions = {};
var map = [];
var types = [];

export default globals.registerIfNotExists('registry', {
  get (id) {
    return hasOwn(definitions, id) && definitions[id];
  },
  set (id, opts) {
    if (this.get(id)) {
      throw new Error(`A Skate component with the name of "${id}" already exists.`);
    }

    var type = opts.type || typeElement;
    var typeIndex = types.indexOf(type);

    if (typeIndex === -1) {
      typeIndex = types.length;
      types.push(type);
      map[typeIndex] = {};
    }

    definitions[id] = opts;
    map[typeIndex][id] = opts;
    apiEmit(document, '_skate-register', {
      bubbles: false,
      detail: opts
    });

    return this;
  },
  find (elem) {
    var filtered = [];
    var typesLength = types.length;

    for (let a = 0; a < typesLength; a++) {
      filtered = filtered.concat(types[a].filter(elem, map[a]) || []);
    }

    return filtered;
  }
});
