// Because weak map polyfills either are too big or don't use native if
// available properly.

let index = 0;
const prefix = '__WEAK_MAP_POLYFILL_';

export default (function () {
  if (typeof WeakMap !== 'undefined') {
    return WeakMap;
  }

  function Polyfill () {
    this.key = prefix + index;
    ++index;
  }

  Polyfill.prototype = {
    get (obj) {
      return obj[this.key];
    },
    set (obj, val) {
      obj[this.key] = val;
    }
  };

  return Polyfill;
})();
