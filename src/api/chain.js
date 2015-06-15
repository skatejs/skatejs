export default function chain (...cbs) {
  cbs = cbs.filter(Boolean).map(cb => {
    if (typeof cb === 'string') {
      return function (...args) {
        if (typeof this[cb] === 'function') {
          this[cb].apply(this, args);
        }
      };
    }

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
