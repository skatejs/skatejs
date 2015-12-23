export default {
  coerce: value => value == null ? '' : String(value),
  deserialize: value => value == null ? undefined : value,
  serialize: value => value ? String(value) : undefined
};
