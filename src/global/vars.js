import global from '../util/global';

const VERSION = '__skate_0_14_0';

if (!global[VERSION]) {
  global[VERSION] = {
    registerIfNotExists (name, value) {
      return this[name] || (this[name] = value);
    }
  };
}

export default global[VERSION];
