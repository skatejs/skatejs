export default function (opts) {
  const { attribute } = opts;

  if (typeof attribute !== 'function') {
    return;
  }

  return function (name, oldValue, newValue) {
    attribute(this, {
      name: name,
      newValue: newValue === null ? undefined : newValue,
      oldValue: oldValue === null ? undefined : oldValue
    });
  };
}
