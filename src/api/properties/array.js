const { parse, stringify } = window.JSON;

export default {
  coerce (val) {
    return Array.isArray(val) ? val : [val];
  },
  default () {
    return [];
  },
  deserialize (val) {
    return parse(val);
  },
  serialize (val) {
    return stringify(val);
  }
};
