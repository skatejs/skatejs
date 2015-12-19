import assign from 'object-assign';
import boolean from './boolean';
import content from './content';
import number from './number';
import string from './string';

function prop (def) {
  return function (...args) {
    args.unshift({}, def);
    return assign.apply(null, args);
  };
}

export default {
  boolean: prop(boolean),
  content: content,
  number: prop(number),
  string: prop(string)
};
