import { PropType } from './types';

const any: PropType = {
  default: (elem, name, oldValue) => null,
  defined: (ctor, name) => {},
  deserialize: (elem, name, oldValue, newValue) => newValue,
  get: (elem, name, oldValue) => oldValue,
  serialize: (elem, name, oldValue, newValue) => newValue,
  set: (elem, name, oldValue, newValue) => newValue,
  source: propName => propName.toLowerCase(),
  target: propName => {}
};

const array: PropType = {
  ...any,
  default: () => [],
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

  // Takes an event handler and returns a function that is invoked with event
  // detail to trigger the corresponding event with.
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

    return detail => elem.dispatchEvent(new CustomEvent(eventName, { detail }));
  },

  // Standardizes custom event names:
  //
  // - Rremove "on" prefix.
  // - Event name becomes all lowercase.
  //
  // e.g. onCustomEvent -> customevent
  getEventName(name: string): string {
    return name.substring(2).toLowerCase();
  }
};

const number: PropType = {
  ...any,
  default: () => 0,
  deserialize: (elem, name, oldValue, newValue): number =>
    newValue == null ? 0 : Number(newValue),
  serialize: (elem, name, oldValue, newValue) =>
    newValue == null ? null : String(Number(newValue))
};

const object: PropType = {
  ...array,
  default: () => ({})
};

const string: PropType = {
  ...any,
  default: () => '',
  deserialize: (elem, name, oldValue, newValue) => newValue,
  serialize: (elem, name, oldValue, newValue) =>
    newValue == null ? null : String(newValue)
};

export const props = {
  any,
  array,
  boolean,
  event,
  number,
  object,
  string
};
