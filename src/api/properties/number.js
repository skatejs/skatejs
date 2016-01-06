import empty from '../../util/empty';

const alwaysUndefinedIfEmpty = val => empty(val) ? undefined : Number(val);

export default {
  coerce: alwaysUndefinedIfEmpty,
  deserialize: alwaysUndefinedIfEmpty,
  serialize: alwaysUndefinedIfEmpty
};
