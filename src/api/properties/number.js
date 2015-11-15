export default {
  coerce: value => typeof value === 'undefined' ? value : Number(value),
  deserialize: value => value === null ? undefined : value,
  serialize: value => typeof value === 'undefined' ? value : Number(value)
};
