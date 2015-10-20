const noop = () => {};

export default function (opts) {
  let callback = opts.attribute;

  if (typeof callback !== 'function') {
    return noop;
  }

  return function (name, oldValue, newValue) {
    callback(this, {
      name: name,
      newValue: newValue === null ? undefined : newValue,
      oldValue: oldValue === null ? undefined : oldValue
    });
  };
}
