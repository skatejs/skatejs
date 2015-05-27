export default function (...callbacks) {
  callbacks = callbacks.filter(Boolean);
  return function (...callbackArgs) {
    callbacks.forEach((callback) => {
      callback.apply(null, callbackArgs);
    });
  };
}
