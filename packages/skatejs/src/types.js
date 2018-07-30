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
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
  detail?: Object;
}
