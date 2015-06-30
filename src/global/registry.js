import types from '../types';
import globals from './vars';
import hasOwn from '../util/has-own';

export default globals.registerIfNotExists('registry', {
  definitions: {},

  get (id) {
    return hasOwn(this.definitions, id) && this.definitions[id];
  },

  set (id, definition) {
    if (this.get(id)) {
      throw new Error(`A Skate component with the name of "${id}" already exists.`);
    }
    this.definitions[id] = definition;
    return this;
  },

  find (elem) {
    var defs = [];
    for (let a in types) {
      defs = defs.concat(types[a].filterDefinitions(elem, this.definitions) || []);
    }
    return defs;
  }
});
