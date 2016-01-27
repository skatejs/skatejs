const VERSION = '__skate_0_14_0';

if (!window[VERSION]) {
  window[VERSION] = {
    registerIfNotExists (name, value) {
      return this[name] || (this[name] = value);
    }
  };
}

export default window[VERSION];
