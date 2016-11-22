//@flow
import assign from '../util/assign';
import empty from '../util/empty';

const alwaysUndefinedIfNotANumberOrNumber = val => (isNaN(val) ? undefined : Number(val));
const alwaysUndefinedIfEmptyOrString = val => (empty(val) ? undefined : String(val));

/**
 * Returns a function to create Property Configurations based on the
 * given template Property Configuration that provides some default options.
 */
export function create(template:IPropConfig) {
  //todo: where this is called will more than on argument?
  return (...args:IPropConfig[]) => {
    args.unshift({}, template);
    return assign(...args);
  };
}

export const array:IPropConfig = create({
  coerce: val => (Array.isArray(val) ? val : [val]),
  default: () => [],
  // Note: JSON.parse(undefined) throws Error
  deserialize: val => (val === undefined ? undefined : JSON.parse(String(val))),
  serialize: JSON.stringify
});

export const boolean:IPropConfig = create({
  coerce: value => !!value,
  default: false,
  deserialize: value => !(value === null),
  serialize: value => (value ? '' : undefined)
});

export const number:IPropConfig = create({
  default: 0,
  coerce: alwaysUndefinedIfNotANumberOrNumber,
  deserialize: alwaysUndefinedIfNotANumberOrNumber,
  serialize: alwaysUndefinedIfNotANumberOrNumber
});

export const string:IPropConfig = create({
  default: '',
  coerce: alwaysUndefinedIfEmptyOrString,
  deserialize: alwaysUndefinedIfEmptyOrString,
  serialize: alwaysUndefinedIfEmptyOrString
});
