export default function chain (...cbs) {
  // Optimisation so that it doesn't wrap at all if you've only passed in a
  // single function.
  if (cbs.length === 1 && typeof cbs[0] === 'function') {
    return cbs[0];
  }

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
