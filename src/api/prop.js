import assign from '../util/assign';
import empty from '../util/empty';

// defaults empty to 0 and allow NaN
const zeroIfEmptyOrNumberIncludesNaN = val => (empty(val) ? 0 : Number(val));
const nullIfEmptyOrString = val => (empty(val) ? null : String(val));

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
  coerce: zeroIfEmptyOrNumberIncludesNaN,
  deserialize: zeroIfEmptyOrNumberIncludesNaN,
  serialize: nullIfEmptyOrString
});

export const string = create({
  default: '',
  coerce: nullIfEmptyOrString,
  deserialize: nullIfEmptyOrString,
  serialize: nullIfEmptyOrString
});
