export const vdom: any;

type PropData = { [prop: string]: any };
export function props(elem: any): PropData;
export function props(elem: any, data?: PropData): void;

export const emit: (elem: any, eventName: string, eventOptions = {}) => boolean;

export class Component extends HTMLElement {}

export function define<C>(name: string, component: C): C;

export function define<Proto, Props>(name: string, definition: {
  prototype: Proto;
  props: Props;
  created?(elem: Component & Proto & Props): any;
  updated?(elem: Component & Proto & Props, prevProps: { [name: string]: any }): boolean | undefined;
  render?(elem: Component & Proto & Props): () => any | undefined;
  rendered?(elem: Component & Proto & Props): any;
  attached?(elem: Component & Proto & Props): any;
  detached?(elem: Component & Proto & Props): any;
  attributeChanged?(elem: Component & Proto & Props, data: { name: string, oldValue: any, newValue: any }): any;
  observedAttributes?: string[];
}): { new(...args: any[]): Component & Proto & Props };

export const symbols: {
  shadowRoot: string | symbol;
  name: string | symbol;
};

export const ready: (elem: HTMLElement, callback: (...args: any[]) => any) => void;

type HOut = () => any;
type HBuilder = (tag: string | Component, attrs?: { [name: string]: string }, ...children: any[]) => HOut;
export const h: HBuilder;

export const builder: (...args: string[]) => HBuilder[];

type PropOptions = {
  attribute?: boolean | string;
  coerce?: (value: any) => any;
  default?: undefined | null | boolean | string | ((elem: any, data: { name: string }) => any);
  deserialize?: (value: string) => any;
  get?: (elem: any, data: { name: string, internalValue: any }) => any;
  initial?: undefined | null | boolean | string | ((elem: any, data: { name: string }) => any);
  serialize?: (value: any) => string;
  set?: (elem: any, data: { name: string, newValue: any, oldValue: any }) => void;
};

export const prop: {
  boolean(options?: PropOptions): PropOptions;
  number(options?: PropOptions): PropOptions;
  string(options?: PropOptions): PropOptions;
  array(options?: PropOptions): PropOptions;
};
