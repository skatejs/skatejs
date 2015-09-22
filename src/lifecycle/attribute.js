export default function (opts) {
  let callback = opts.attribute || function () {};
  return function (name, oldValue, newValue) {
    callback(this, {
      name: name,
      newValue: newValue,
      oldValue: oldValue
    });
  };
}
