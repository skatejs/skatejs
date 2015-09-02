export default function (...callbacks) {
  return function (...args) {
    callbacks.forEach(callback => callback.apply(this, args));
  };
}
