import empty from './util/empty';
import toNullOrString from './util/to-null-or-string';

const freeze = Object.freeze;
const attribute = freeze({ source: true });
const parseIfNotEmpty = val => (empty(val) ? null : JSON.parse(val));
const zeroIfEmptyOrNumberIncludesNaN = val => (empty(val) ? 0 : Number(val));
const sharedFrozenArray = Object.freeze([]);
const sharedFrozenObject = Object.freeze({});

export const array = freeze({
  attribute,
  coerce: val => (Array.isArray(val) ? val : (empty(val) ? null : [val])),
  default: () => sharedFrozenArray,
  deserialize: parseIfNotEmpty,
  serialize: JSON.stringify
});

export const boolean = freeze({
  attribute,
  coerce: val => !!val,
  default: false,
  deserialize: val => !(val === null),
  serialize: val => (val ? '' : null)
});

export const number = freeze({
  attribute,
  default: 0,
  coerce: zeroIfEmptyOrNumberIncludesNaN,
  deserialize: zeroIfEmptyOrNumberIncludesNaN,
  serialize: toNullOrString
});

export const string = freeze({
  attribute,
  default: '',
  coerce: toNullOrString,
  deserialize: toNullOrString,
  serialize: toNullOrString
});

export const object = freeze({
  attribute,
  default: () => sharedFrozenObject,
  deserialize: parseIfNotEmpty,
  serialize: JSON.stringify
});
