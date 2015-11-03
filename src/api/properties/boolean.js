export default {
  coerce: value => !!value,
  default: false,
  deserialize: value => !(value === null),
  serialize: value => value ? '' : undefined
};
