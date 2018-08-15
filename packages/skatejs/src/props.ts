import { PropType } from './types';

const formatAttributeName = propName => propName.toLowerCase();
const isEmpty = (val: any): boolean => val == null;

const any: PropType = {
  deserialize: JSON.parse,
  serialize: JSON.stringify,
  source: formatAttributeName,
  target: formatAttributeName
};
const array: PropType = any;
const boolean: PropType = {
  ...any,
  deserialize: (val): boolean => !isEmpty(val),
  serialize: (val: boolean) => (val ? '' : null)
};
const number: PropType = {
  ...any,
  deserialize: (val): number => (isEmpty(val) ? 0 : Number(val)),
  serialize: (val: number) => (isEmpty(val) ? null : String(Number(val)))
};
const object: PropType = any;
const string: PropType = {
  ...any,
  deserialize: val => val,
  serialize: val => (isEmpty(val) ? null : String(val))
};

export const props = {
  any,
  array,
  boolean,
  number,
  object,
  string
};
