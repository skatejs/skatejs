export default {
  default: false,
  deserialize: value => value === null ? false : true,
  serialize: value => value ? '' : undefined
};
