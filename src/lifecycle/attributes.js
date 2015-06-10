import chain from '../util/chain';
import data from '../util/data';
import notify from './notify';
import protos from '../util/protos';

var lifecycleNames = ['created', 'updated', 'removed'];

function validLifecycles (obj) {
  return protos(obj || {})
    .reduce((prev, curr) => prev.concat(Object.getOwnPropertyNames(curr)), [])
    .filter((key, idx, arr) => arr.lastIndexOf(key) === idx)
    .filter(key => lifecycleNames.some(val => key.indexOf(val) !== -1));
}

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

  var map = validLifecycles(types).reduce(function (obj, unsplit) {
    return unsplit.split(' ').reduce(function (obj, split) {
      (obj[split] = obj[split] || []).push(unsplit);
      return obj;
    }, obj);
  }, {});

  return function (elem, diff) {
    (map[diff.type] || []).forEach(function (cb) {
      types[cb](elem, diff);
    });
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
    chain(fns[diff.name]).call(this, elem, diff);
  };
}

export default function (opts) {
  var callback = makeGlobalCallback(opts.attributes);
  return function (name, oldValue, newValue) {
    var attributeToPropertyMap = data(this).attributeToPropertyMap;

    callback(this, {
      name: name,
      newValue: newValue === undefined ? null : newValue,
      oldValue: oldValue === undefined ? null : oldValue,
      type: resolveType(oldValue, newValue)
    });

    // Ensure properties are notified of this change.
    if (attributeToPropertyMap[name]) {
      notify(this, attributeToPropertyMap[name]);
    }
  };
}
