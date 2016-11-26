import assign from '../util/assign.js';
import empty from '../util/empty.js';

const alwaysUndefinedIfNotANumberOrNumber = (val:any) => (isNaN(val) ? undefined : Number(val));
const alwaysUndefinedIfNotANumberOrString = (val:any) => (isNaN(val) ? undefined : String(val));
const alwaysUndefinedIfEmptyOrString = (val:any) => (empty(val) ? undefined : String(val));

/**
 * Returns a function to generate Property Configurations that will contain
 * the default options defined in the template and
 * the options defined in the config object when calling the function.
 */
export function create (template:IPropConfig):IPropConfig {
  return (config:IPropConfig) => {
    return assign({}, template, config) as IPropConfig;
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
  // todo: rollup-plugin-typescript doesn't support strictNullChecks option!
  // deserialize: (value:string|null) => !(value === null),
  deserialize: (value:string) => !(value === null),
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
