export default {
  default: false,
  deserialize: value => !(value === null),
  serialize: value => value ? '' : undefined,
  type: value => !!value
};
