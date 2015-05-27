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

function resolveCallbacks (name, type, attrs) {
  var callbacks;
  var specific = attrs && attrs[name];

  // { attributes: { name: { created: function () {} } } }
  if (specific && typeof specific[type] === 'function') {
    callbacks = specific[type];
  // { attributes: { name: function () {} } }
  } else if (typeof specific === 'function') {
    callbacks = specific;
  // { attributes: function () {} }
  } else if (typeof attrs === 'function') {
    callbacks = attrs;
  }

  if (!callbacks) {
    callbacks = [];
  }

  if (!Array.isArray(callbacks)) {
    callbacks = [callbacks];
  }

  return callbacks;
}

export default function (options) {
  return function (name, oldValue, newValue) {
    var callbacks, type;

    if (oldValue === newValue) {
      return;
    }

    type = resolveType(oldValue, newValue);
    callbacks = resolveCallbacks(name, type, options.attributes);

    // Ensure values are null if undefined.
    newValue = newValue === undefined ? null : newValue;
    oldValue = oldValue === undefined ? null : oldValue;

    // Callbacks should be normalised to an array.
    callbacks.forEach((callback) => {
      callback(this, {
        type: type,
        name: name,
        newValue: newValue,
        oldValue: oldValue
      });
    });
  };
}
