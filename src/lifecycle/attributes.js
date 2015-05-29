import chain from '../api/chain';

function resolveType (oldValue, newValue) {
  var newValueIsString = typeof newValue === 'string';
  var oldValueIsString = typeof oldValue === 'string';

  if (!oldValueIsString && newValueIsString) {
    return 'created';
  } else if (oldValueIsString && newValueIsString) {
    return 'updated';
  } else if (oldValueIsString && !newValueIsString) {
    return 'removed';
  }
}

function makeSpecificCallback (types) {
  var fns = {};

  if (typeof types === 'function') {
    return types;
  }

  Object.keys(types).forEach(function (type) {
    type.split(' ').forEach(function (part) {
      fns[part] = chain(fns[part], types[type]);
    });
  });

  return function (elem, diff) {
    chain(fns[diff.type])(elem, diff);
  };
}

function makeGlobalCallback (attrs) {
  var fns = {};

  if (typeof attrs === 'function') {
    return attrs;
  }

  Object.keys(attrs).forEach(function (name) {
    fns[name] = makeSpecificCallback(attrs[name] || {});
  });

  return function (elem, diff) {
    chain(fns[diff.name])(elem, diff);
  };
}

export default function (attributes = {}) {
  var callback = makeGlobalCallback(attributes);
  return function (name, newValue, oldValue) {
    callback(this, {
      name: name,
      newValue: newValue === undefined ? null : newValue,
      oldValue: oldValue === undefined ? null : oldValue,
      type: resolveType(oldValue, newValue)
    });
  };
}
