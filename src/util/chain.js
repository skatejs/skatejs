export default function chain (...callbacks) {
  callbacks = callbacks.filter(Boolean).map(function (callback) {
    return typeof callback === 'object' ?
      chain.apply(null, callback) :
      callback;
  });

  return function (...args) {
    callbacks.forEach((callback) => {
      callback.apply(this, args);
    });
  };
}
