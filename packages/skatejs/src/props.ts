import { PropType } from './types';

const formatAttributeName = propName => propName.toLowerCase();

const any: PropType = {
  deserialize: JSON.parse,
  serialize: JSON.stringify,
  source: formatAttributeName,
  target: formatAttributeName
};
const array: PropType = any;
const boolean: PropType = {
  ...any,
  deserialize: (val): boolean => val !== null,
  serialize: (val: boolean) => (val ? '' : null)
};
const number: PropType = {
  ...any,
  deserialize: (val): number => (val == null ? 0 : Number(val)),
  serialize: (val: number) => (val == null ? null : String(Number(val)))
};
const object: PropType = any;
const string: PropType = {
  ...any,
  deserialize: val => val,
  serialize: val => (val == null ? null : String(val))
};

export const props = {
  any,
  array,
  boolean,
  number,
  object,
  string
};
