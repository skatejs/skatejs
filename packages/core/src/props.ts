import { PropType } from './types';

const any: PropType = {
  defined: (elem, name) => {},
  default: (elem, name) => null,
  deserialize: (elem, name, oldValue, newValue) => newValue,
  get: (elem, name, value) => value,
  serialize: (elem, name, oldValue, newValue) => newValue,
  set: (elem, name, oldValue, newValue) => newValue,
  source: propName => propName.toLowerCase(),
  target: propName => {}
};

const object: PropType = {
  ...any,
  deserialize: (elem, name, oldValue, newValue) => JSON.parse(newValue),
  serialize: (elem, name, oldValue, newValue) => JSON.stringify(newValue)
};

const boolean: PropType = {
  ...any,
  deserialize: (elem, name, oldValue, newValue): boolean => newValue != null,
  serialize: (elem, name, oldValue, newValue) => (newValue ? '' : null)
};

const event: PropType = {
  ...any,
  set(elem, name, oldValue, newValue) {
    // TODO see if we can deserialize to a standard onclick prop so that we
    // can support in-attribute handlers.
    const eventName = this.getEventName(name);
    if (oldValue) {
      elem.removeEventListener(eventName, oldValue);
    }
    if (newValue) {
      elem.addEventListener(eventName, newValue);
    }
    return newValue;
  },
  getEventName(name: string): string {
    return name;
  }
};

const number: PropType = {
  ...any,
  deserialize: (elem, name, oldValue, newValue): number =>
    newValue == null ? 0 : Number(newValue),
  serialize: (elem, name, oldValue, newValue) =>
    newValue == null ? null : String(Number(newValue))
};

const array: PropType = object;

const string: PropType = {
  ...any,
  deserialize: (elem, name, oldValue, newValue) => newValue,
  serialize: (elem, name, oldValue, newValue) =>
    newValue == null ? null : String(newValue)
};

export default {
  any,
  array,
  boolean,
  event,
  number,
  object,
  string
};
