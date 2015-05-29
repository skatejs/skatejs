export default function chain (...cbs) {
  cbs = cbs.filter(Boolean).map(cb =>
    typeof cb === 'object' ? chain.apply(null, cb) : cb);

  return function (...args) {
    cbs.forEach(cb => cb.apply(this, args));
  };
}
