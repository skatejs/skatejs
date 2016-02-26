import version from '../api/version';

const VERSION = `__skate_${version.replace(/[^\w]/g, '_')}`;

if (!window[VERSION]) {
  window[VERSION] = {
    registerIfNotExists (name, value) {
      return this[name] || (this[name] = value);
    }
  };
}

export default window[VERSION];
