import assign from '../util/assign';
import empty from '../util/empty';

const alwaysUndefinedIfNotANumberOrNumber = val => (isNaN(val) ? undefined : Number(val));
const alwaysUndefinedIfEmptyOrString = val => (empty(val) ? undefined : String(val));

export function create(def) {
  return (...args) => {
    args.unshift({}, def);
    return assign(...args);
  };
}

export const array = create({
  coerce: val => (Array.isArray(val) ? val : [val]),
  default: () => [],
  deserialize: JSON.parse,
  serialize: JSON.stringify,
});

export const boolean = create({
  coerce: value => !!value,
  default: false,
  deserialize: value => !(value === null),
  serialize: value => (value ? '' : undefined),
});

export const number = create({
  default: 0,
  coerce: alwaysUndefinedIfNotANumberOrNumber,
  deserialize: alwaysUndefinedIfNotANumberOrNumber,
  serialize: alwaysUndefinedIfNotANumberOrNumber,
});

export const string = create({
  default: '',
  coerce: alwaysUndefinedIfEmptyOrString,
  deserialize: alwaysUndefinedIfEmptyOrString,
  serialize: alwaysUndefinedIfEmptyOrString,
});
