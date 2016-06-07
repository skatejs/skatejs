import assign from 'object-assign';
import empty from '../util/empty';

const alwaysUndefinedIfEmptyOrNumber = val => empty(val) ? undefined : Number(val);
const alwaysUndefinedIfEmptyOrString = val => empty(val) ? undefined : String(val);

export function create (def) {
  return function (...args) {
    args.unshift({}, def);
    return assign.apply(null, args);
  };
}

export const array = create({
  coerce: val => Array.isArray(val) ? val : [val],
  default: () => [],
  deserialize: JSON.parse,
  serialize: JSON.stringify
});

export const boolean = create({
  coerce: value => !!value,
  default: false,
  deserialize: value => !(value === null),
  serialize: value => value ? '' : undefined
});

export const number = create({
  coerce: alwaysUndefinedIfEmptyOrNumber,
  deserialize: alwaysUndefinedIfEmptyOrNumber,
  serialize: alwaysUndefinedIfEmptyOrNumber
});

export const string = create({
  coerce: alwaysUndefinedIfEmptyOrString,
  deserialize: alwaysUndefinedIfEmptyOrString,
  serialize: alwaysUndefinedIfEmptyOrString
});
