import assign from '../util/assign';
import empty from '../util/empty';

const alwaysNullIfNotANumberOrNumber = val => (isNaN(val) ? null : Number(val));
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
  // todo: 'false' string must deserialize to false for angular 1.x to work
  // This breaks one existing test.
  // deserialize: val => !(val === null || val === 'false'),
  deserialize: val => !(val === null),
  serialize: val => (val ? '' : null)
});

export const number = create({
  default: 0,
  coerce: alwaysNullIfNotANumberOrNumber,
  deserialize: alwaysNullIfNotANumberOrNumber,
  serialize: alwaysNullIfEmptyOrString
});

export const string = create({
  default: '',
  coerce: alwaysNullIfEmptyOrString,
  deserialize: alwaysNullIfEmptyOrString,
  serialize: alwaysNullIfEmptyOrString
});
