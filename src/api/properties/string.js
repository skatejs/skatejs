export default {
  coerce: value => typeof value === 'undefined' ? value : String(value),
  deserialize: value => value === null ? undefined : value,
  serialize: value => typeof value === 'undefined' ? value : String(value)
};
