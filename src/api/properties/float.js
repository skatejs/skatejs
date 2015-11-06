import assign from 'object-assign';
export default assign.bind(null, {}, {
  coerce: parseFloat,
  default: 0,
  serialize: String,
  deserialize: parseFloat
});
