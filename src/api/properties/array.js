export default {
  coerce (val) {
    return Array.isArray(val) ? val : [val];
  },
  default () {
    return [];
  },
  deserialize (val) {
    return val.split(',');
  },
  serialize (val) {
    return val.join(',');
  }
};
