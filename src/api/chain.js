export default function chain (...callbacks) {
  callbacks = callbacks.filter(Boolean).map(function (callback) {
    return typeof callback === 'object' ?
      chain.apply(null, callback) :
      callback;
  });

  return (...args) => {
    for (let callback of callbacks) {
      callback.apply(null, args);
    }
  };
}
