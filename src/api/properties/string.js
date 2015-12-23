import empty from '../../util/empty';

export default {
  coerce: value => empty(value) ? '' : String(value),
  deserialize: value => empty(value) ? undefined : value,
  serialize: value => value ? String(value) : undefined
};
