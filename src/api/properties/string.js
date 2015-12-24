import empty from '../../util/empty';

const alwaysUndefinedIfEmpty = val => empty(val) ? undefined : String(val);

export default {
  coerce: alwaysUndefinedIfEmpty,
  deserialize: alwaysUndefinedIfEmpty,
  serialize: alwaysUndefinedIfEmpty
};
