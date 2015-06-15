export default function chain (...cbs) {
  cbs = cbs.filter(Boolean).map(cb => {
    if (typeof cb === 'object') {
      return chain.apply(null, cb);
    }

    if (typeof cb === 'string') {
      return function (...args) {
        if (typeof this[cb] === 'function') {
          this[cb].apply(this, args);
        }
      };
    }

    return cb;
  });

  return function (...args) {
    cbs.forEach(cb => cb.apply(this, args));
    return this;
  };
}
