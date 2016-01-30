import globals from './vars';

const definitions = {};
const map = [];
const types = [];
const hasOwn = Object.prototype.hasOwnProperty;

export default globals.registerIfNotExists('registry', {
  get (name) {
    return hasOwn.call(definitions, name) && definitions[name];
  },
  set (name, Ctor) {
    if (this.get(name)) {
      throw new Error(`A Skate component with the name of "${name}" already exists.`);
    }

    const type = Ctor.type;
    let typeIndex = types.indexOf(type);

    if (typeIndex === -1) {
      typeIndex = types.length;
      types.push(type);
      map[typeIndex] = {};
    }

    return definitions[name] = map[typeIndex][name] = Ctor;
  },
  find (elem) {
    const typesLength = types.length;
    for (let a = 0; a < typesLength; a++) {
      const reduced = types[a].reduce(elem, map[a]);
      if (reduced) {
        return reduced;
      }
    }
  }
});
