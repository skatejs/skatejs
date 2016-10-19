export default function overridePropertyGetter (name) {
  return function set (value) {
    Object.defineProperty(this, name, {
      value,
      writable: true
    });
  };
}
