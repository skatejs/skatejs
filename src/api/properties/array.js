export default {
  coerce: val => Array.isArray(val) ? val : [val],
  default: () => [],
  deserialize: JSON.parse,
  serialize: JSON.stringify
};
