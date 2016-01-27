import globals from './vars';

const definitions = {};
const map = [];
const types = [];

export default globals.registerIfNotExists('registry', {
  get (name) {
    return Object.prototype.hasOwnProperty.call(definitions, name) && definitions[name];
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
    let filtered = [];
    const typesLength = types.length;
    for (let a = 0; a < typesLength; a++) {
      filtered = filtered.concat(types[a].filter(elem, map[a]) || []);
    }
    return filtered;
  }
});
