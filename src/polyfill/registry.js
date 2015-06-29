import bindings from '../api/type';
import globals from '../globals';
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
    for (let a in bindings) {
      defs = defs.concat(bindings[a].possible(elem, this.definitions) || []);
    }
    return defs;
  }
});
