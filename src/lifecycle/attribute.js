export default function (options) {
  return function (name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    var callback;
    var type;
    var newValueIsString = typeof newValue === 'string';
    var oldValueIsString = typeof oldValue === 'string';
    var attrs = options.attributes;
    var specific = attrs && attrs[name];

    if (!oldValueIsString && newValueIsString) {
      type = 'created';
    } else if (oldValueIsString && newValueIsString) {
      type = 'updated';
    } else if (oldValueIsString && !newValueIsString) {
      type = 'removed';
    }

    if (specific && typeof specific[type] === 'function') {
      callback = specific[type];
    } else if (specific && typeof specific.fallback === 'function') {
      callback = specific.fallback;
    } else if (typeof specific === 'function') {
      callback = specific;
    } else if (typeof attrs === 'function') {
      callback = attrs;
    }

    // Ensure values are null if undefined.
    newValue = newValue === undefined ? null : newValue;
    oldValue = oldValue === undefined ? null : oldValue;

    // There may still not be a callback.
    if (callback) {
      callback(this, {
        type: type,
        name: name,
        newValue: newValue,
        oldValue: oldValue
      });
    }
  };
}
