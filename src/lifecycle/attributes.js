import chain from '../util/chain';

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
  if (typeof types === 'function') {
    return types;
  }

  var fns = Object.keys(types || {}).reduce(function (prev, curr) {
    return curr.split(' ').reduce(function (prev, curr) {
      prev[curr] = chain(prev[curr], types[curr]);
      return prev;
    }, prev);
  }, {});

  return function (elem, diff) {
    chain(fns[diff.type])(elem, diff);
  };
}

function makeGlobalCallback (attrs) {
  if (typeof attrs === 'function') {
    return attrs;
  }

  var fns = Object.keys(attrs || {}).reduce(function (prev, curr) {
    prev[curr] = makeSpecificCallback(attrs[curr]);
    return prev;
  }, {});

  return function (elem, diff) {
    chain(fns[diff.name])(elem, diff);
  };
}

export default function (attributes) {
  var callback = makeGlobalCallback(attributes);
  return function (name, oldValue, newValue) {
    callback(this, {
      name: name,
      newValue: newValue === undefined ? null : newValue,
      oldValue: oldValue === undefined ? null : oldValue,
      type: resolveType(oldValue, newValue)
    });
  };
}
