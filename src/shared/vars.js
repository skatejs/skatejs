// This should only be changed / incremented when the internal shared API
// changes in a backward incompatible way. It's designed to be shared with
// other Skate versions if it's compatible for performance reasons and also
// to align with the spec since in native there is a global registry.
const VERSION = '__skate_0_16_0';

if (!window[VERSION]) {
  window[VERSION] = {
    registerIfNotExists (name, value) {
      return this[name] || (this[name] = value);
    }
  };
}

export default window[VERSION];
