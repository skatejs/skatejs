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
  // todo: When angular 1 binds to attribute 'false' must deserialize to false
  // this breaks one existing test.
  // deserialize: val => !(val === null || val === 'false'),
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
