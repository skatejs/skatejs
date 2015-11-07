import assign from 'object-assign';
export default assign.bind(null, {}, {
  coerce: value => !!value,
  default: false,
  deserialize: value => !(value === null),
  serialize: value => value ? '' : undefined
});
