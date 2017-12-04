// @flow

// Generic
export type DeepObject = { [string]: Object };

// Adding to the HTMLElemeht type.
export type CustomElement = Class<HTMLElement> & { is: string };

// Fixing EventTarget for covariant element types.
export type CustomElementLink = EventTarget & {
  checked?: boolean,
  name?: string,
  type?: string,
  value?: string
};

// Custom events
export type CustomElementEvent = CustomEvent & {
  composed?: boolean,
  composedPath?: () => Array<Node>
};
export interface CustomElementEventOptions {
  bubbles: boolean;
  cancelable: boolean;
  composed: boolean;
  detail?: void | Object;
}

// Props
type PropTypeAttributeIdentifier = boolean | string;
type PropTypeAttribute =
  | PropTypeAttributeIdentifier
  | {
      source?: PropTypeAttributeIdentifier,
      target?: PropTypeAttributeIdentifier
    };
export type PropType = {
  attribute?: PropTypeAttribute,
  coerce?: Function,
  default?: any,
  deserialize?: (val: string) => mixed,
  serialize?: (val: mixed) => null | string
};
export type PropTypeNormalized = {
  attribute: { source: string, target: string },
  coerce: (val: mixed) => mixed,
  default: mixed,
  deserialize: (val: mixed) => mixed,
  serialize: (val: mixed) => null | string
};
export type PropTypes = { [string]: PropType };
export type PropTypesNormalized = { [string]: PropTypeNormalized };
