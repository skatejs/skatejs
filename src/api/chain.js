export default function chain (...cbs) {
  cbs = cbs.filter(Boolean).map(cb => {
    // Strings point to a function on the context passed to the proxy fn.
    if (typeof cb === 'string') {
      return function (...args) {
        if (typeof this[cb] === 'function') {
          this[cb].apply(this, args);
        }
      };
    }

    // Arrays are passed through and object values become an array of values.
    if (typeof cb === 'object') {
      cb = Array.isArray(cb) ? cb : Object.keys(cb).map(key => cb[key]);
      return chain.apply(this, cb);
    }

    return cb;
  });

  return function (...args) {
    cbs.forEach(cb => cb.apply(this, args));
    return this;
  };
}
