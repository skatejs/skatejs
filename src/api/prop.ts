import assign from '../util/assign.js';
import empty from '../util/empty.js';

/**
 * Options to configure a property
 */
export type PropOptions = {
  attribute?: boolean | string;
  coerce?: (value: any) => any;
  default?: undefined | null | boolean | number | string | ((elem: any, data: { name: string | symbol }) => any);
  deserialize?: (value: undefined | null | string) => any;
  get?: (elem: any, data: { name: string | symbol, internalValue: any }) => any;
  initial?: undefined | null | boolean | number | string | ((elem: any, data: { name: string }) => any);
  serialize?: (value: any) => null | string;
  set?: (elem: any, data: { name: string | symbol, newValue: any, oldValue: any }) => void;
};

const alwaysUndefinedIfNotANumberOrNumber = (val:any) => (isNaN(val) ? undefined : Number(val));
const alwaysUndefinedIfEmptyOrString = (val:any) => (empty(val) ? undefined : String(val));

/**
 * Returns a function to generate Property Options that will contain
 * the default options defined in the template and
 * the options defined in the options object when calling the function.
 */
export function create (template:PropOptions):PropOptions {
  return (options:PropOptions) => {
    return assign({}, template, options) as PropOptions;
  };
}

export const array:PropOptions = create({
  coerce: (value:any) => (Array.isArray(value) ? value : (empty(value) ? [] : [value])),
  default: ():any[] => [],
  deserialize: (value:undefined | null | string) => (empty(value) ? null : JSON.parse(String(value))),
  serialize: JSON.stringify
});

export const boolean:PropOptions = create({
  coerce: (value:any) => !!value,
  default: false,
  deserialize: (value:undefined | null | string) => !(value === null),
  serialize: (value:any) => (value ? '' : null)
});

export const number:PropOptions = create({
  default: 0,
  coerce: alwaysUndefinedIfNotANumberOrNumber,
  deserialize: alwaysUndefinedIfNotANumberOrNumber,
  serialize: (value:any) => (isNaN(value) ? null : String(value))
});

export const string:PropOptions = create({
  default: '',
  coerce: alwaysUndefinedIfEmptyOrString,
  deserialize: alwaysUndefinedIfEmptyOrString,
  serialize: (value:any) => (empty(value) ? null : String(value))
});
