import assign from 'object-assign';
export default assign.bind(null, {}, {
  type: Number,
  default: 0,
  serialize: String,
  deserialize: Number
});
