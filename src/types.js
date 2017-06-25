// @flow

// We add "composed" to CustomEvent because we want both the "composed" flag
// and the "detail" property to work in native.
export interface ComposedCustomEvent extends CustomEvent {
  composed?: boolean;
  composedPath?: () => Array<Node>;
}

// The available options to events.
export interface EventOptions {
  bubbles: boolean,
  cancelable: boolean,
  composed: boolean,
  detail?: void | Object
}

// We need to type custom elements.
export interface CustomElement extends HTMLElement {
  static is: string;
  attributeChangedCallback(name: string, oldValue: any, newValue: any): void;
  connectedCallback(): void;
  disconnectedCallback(): void;
}

// To be able to recursively traverse into an object based on dot-notation.
export type DeepObject = { [string]: Object };

// Types are only defined for define().
export interface FixedCustomElementRegistry extends CustomElementRegistry {
  get (name: string): HTMLElement | null;
}

export type PropOptionsAttributeIdentifier = boolean | string;

export type PropOptionsAttribute = PropOptionsAttributeIdentifier | {
  source?: PropOptionsAttributeIdentifier,
  target?: PropOptionsAttributeIdentifier
};

export type PropOptions = {
  attribute?: PropOptionsAttribute,
  coerce?: Function,
  default?: any,
  deserialize?: (val: string) => mixed,
  serialize?: (val: mixed) => null | string
};

export type PropOptionsNormalized = {
  attribute: { source: string, target: string},
  coerce: (val: mixed) => mixed,
  default: mixed,
  deserialize: (val: mixed) => mixed,
  serialize: (val: mixed) => null | string
}

export type PropsOptions = { [string]: PropOptions };
export type PropsOptionsNormalized = { [string]: PropOptionsNormalized };

export type WithLink = EventTarget & {
  checked?: boolean;
  name?: string;
  type?: string;
  value?: string;
};

export type HasConstructor = {
  constructor: Function
};
