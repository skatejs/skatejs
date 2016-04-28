import array from './array';
import assign from 'object-assign';
import boolean from './boolean';
import number from './number';
import string from './string';

function prop (def) {
  return function (...args) {
    args.unshift({}, def);
    return assign.apply(null, args);
  };
}

export default {
  array: prop(array),
  boolean: prop(boolean),
  number: prop(number),
  string: prop(string)
};
