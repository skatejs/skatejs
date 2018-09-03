import { PropType } from './types';

const any: PropType = {
  defined: null,
  deserialize: val => val,
  get: (elem, name, value) => value,
  serialize: val => val,
  set: (elem, name, oldValue, newValue) => newValue,
  source: propName => propName.toLowerCase(),
  target: () => {}
};

const array: PropType = {
  ...any,
  deserialize: JSON.parse,
  serialize: JSON.stringify
};

const boolean: PropType = {
  ...any,
  deserialize: (val): boolean => val != null,
  serialize: (val: boolean) => (val && val !== 'false' ? '' : null)
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
  deserialize: (val): number => (val == null ? 0 : Number(val)),
  serialize: (val: number) => (val == null ? null : String(Number(val)))
};

const object: PropType = array;

const string: PropType = {
  ...any,
  deserialize: val => val,
  serialize: val => (val == null ? null : String(val))
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
