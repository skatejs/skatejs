const formatAttributeName = propName => propName.toLowerCase();
const isEmpty = (val: any): boolean => val == null;

export type NormalizedPropType = {
  deserialize: (string) => any;
  serialize: (any) => string | void;
  source: (string) => string;
  target: (string) => string;
};
export type NormalizedPropTypes = Array<{
  propName: string;
  propType: NormalizedPropType;
}>;
export type PropType =
  | ArrayConstructor
  | BooleanConstructor
  | NumberConstructor
  | ObjectConstructor
  | StringConstructor
  | NormalizedPropType;
export type PropTypes = {
  [s: string]: PropType;
};

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
