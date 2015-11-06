import assign from 'object-assign';
export default assign.bind(null, {}, {
  type: String,
  default: '',
  deserialize: String,
  serialize: String
});
