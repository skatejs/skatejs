/// <reference path="../../types-local-declares/node-require/index.d.ts"/>

// import assign from '../util/assign.js';
const assign = require('../util/assign.js').default;

// import empty from '../util/empty.js';
const empty = require('../util/empty.js').default;

const alwaysUndefinedIfNotANumberOrNumber = (val:any) => (isNaN(val) ? undefined : Number(val));
const alwaysUndefinedIfNotANumberOrString = (val:any) => (isNaN(val) ? undefined : String(val));
const alwaysUndefinedIfEmptyOrString = (val:any) => (empty(val) ? undefined : String(val));

/**
 * Returns a function to create Property Configurations based on the
 * given template Property Configuration that provides some default options.
 */
export function create (template:IPropConfig):IPropConfig {
  //todo: where this is called will more than on argument?
  return (...args:IPropConfig[]) => {
    args.unshift({}, template);
    return assign(...args);
  };
}

export const array:IPropConfig = create({
  coerce: (val:any) => (Array.isArray(val) ? val : [val]),
  default: ():any[] => [],
  deserialize: JSON.parse,
  serialize: JSON.stringify
});

export const boolean:IPropConfig = create({
  coerce: (value:any) => !!value,
  default: false,
  deserialize: (value:null|string) => !(value === null),
  serialize: (value:any) => (value ? '' : undefined)
});

export const number:IPropConfig = create({
  default: 0,
  coerce: alwaysUndefinedIfNotANumberOrNumber,
  deserialize: alwaysUndefinedIfNotANumberOrNumber,
  serialize: alwaysUndefinedIfNotANumberOrString
});

export const string:IPropConfig = create({
  default: '',
  coerce: alwaysUndefinedIfEmptyOrString,
  deserialize: alwaysUndefinedIfEmptyOrString,
  serialize: alwaysUndefinedIfEmptyOrString
});
