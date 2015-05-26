function resolveType (oldValue, newValue) {
  var type;
  var newValueIsString = typeof newValue === 'string';
  var oldValueIsString = typeof oldValue === 'string';

  if (!oldValueIsString && newValueIsString) {
    type = 'created';
  } else if (oldValueIsString && newValueIsString) {
    type = 'updated';
  } else if (oldValueIsString && !newValueIsString) {
    type = 'removed';
  }

  return type;
}

function resolveCallback (name, type, attrs) {
  var callback;
  var specific = attrs && attrs[name];

  if (specific && typeof specific[type] === 'function') {
    callback = specific[type];
  } else if (specific && typeof specific.fallback === 'function') {
    callback = specific.fallback;
  } else if (typeof specific === 'function') {
    callback = specific;
  } else if (typeof attrs === 'function') {
    callback = attrs;
  }

  return callback;
}

export default function (options) {
  return function (name, oldValue, newValue) {
    var callback, type;

    if (oldValue === newValue) {
      return;
    }

    type = resolveType(oldValue, newValue);
    callback = resolveCallback(name, type, options.attributes);

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
