import assign from '../util/assign';
import empty from '../util/empty';

const alwaysUndefinedIfNotANumberOrNumber = val => (isNaN(val) ? undefined : Number(val));
const alwaysNullIfEmptyOrString = val => (empty(val) ? null : String(val));

export function create (def) {
  return (...args) => {
    args.unshift({}, def);
    return assign(...args);
  };
}

export const array = create({
  coerce: val => (Array.isArray(val) ? val : (empty(val) ? null : [val])),
  default: () => [],
  deserialize: val => (empty(val) ? null : JSON.parse(val)),
  serialize: JSON.stringify
});

export const boolean = create({
  coerce: val => !!val,
  default: false,
  deserialize: val => !(val === null),
  serialize: val => (val ? '' : null)
});

export const number = create({
  default: 0,
  coerce: alwaysUndefinedIfNotANumberOrNumber,
  deserialize: alwaysUndefinedIfNotANumberOrNumber,
  serialize: alwaysNullIfEmptyOrString
});

export const string = create({
  default: '',
  coerce: alwaysNullIfEmptyOrString,
  deserialize: alwaysNullIfEmptyOrString,
  serialize: alwaysNullIfEmptyOrString
});
