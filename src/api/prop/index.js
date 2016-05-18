import assign from 'object-assign';
import propArray from './array';
import propBoolean from './boolean';
import propNumber from './number';
import propString from './string';

export default function prop (def) {
  return function (...args) {
    args.unshift({}, def);
    return assign.apply(null, args);
  };
}

export const array = prop(propArray);
export const boolean = prop(propBoolean);
export const number = prop(propNumber);
export const string = prop(propString);
