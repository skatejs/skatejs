export { } from "./jsx";

export as namespace skate;

export class Component extends HTMLElement implements ICustomElementV1, ISkateLivecycle {
  static readonly props: { [nameOrSymbol: string]: PropOptions<El, any> };
  static readonly observedAttributes: string[];

  // Custom Elements v1
  connectedCallback(): void;
  disconnectedCallback(): void;
  attributeChangedCallback(name: string, oldValue: null | string, newValue: null | string): void;
  adoptedCallback?(): void;

  // SkateJS Livecycle
  updatedCallback(previousProps: { [nameOrSymbol: string]: any }): boolean;
  renderCallback(): any;
  renderedCallback(): void;
                          
  // SkateJS DEPRECATED
  static created?(elem: Component): void;
  static attached?(elem: Component): void;
  static detached?(elem: Component): void;
  static attributeChanged?(elem: Component, data: { name: string, oldValue: null | string, newValue: null | string }): void;
  static updated(elem: Component, prevProps: { [nameOrSymbol: string]: any }): boolean;
  static render?(elem: Component): any | undefined;
  static rendered?(elem: Component): void;  
}

export interface PropOptions<El, T> {
  attribute?: boolean | string;
  coerce?: (value: T | null) => T | null | undefined | void;
  default?: ((elem: El, data: { name: string; }) => T) | T;
  deserialize?: (value: string | null) => T | null;
  get?: <R>(elem: El, data: { name: string; internalValue: T; }) => R;
  initial?: T | ((elem: El, data: { name: string; }) => T);
  serialize?: (value: T | null) => string | null;
  set?: (elem: El, data: { name: string; newValue: T; oldValue: T; }) => void;
}

export var define: {
  (name: string, ctor: Function): any;
  (ctor: Function): any;
};

export interface EmitOptions {
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
  detail?: any;
}
export function emit(elem: EventTarget, name: string, opts?: EmitOptions): void;

export function link(elem: Component, target?: string): (e: Event) => void;

type VDOMElementTName = string | typeof Component | typeof vdom.element | { id: string; };
type VDOMElementChild = Function | string | number;
type VDOMElementSet = VDOMElementChild | VDOMElementChild[];

export var h: typeof vdom.element;

export var vdom: {
  element(tname: VDOMElementTName, attrs: { key: any; statics: any; } & any, ...chren: VDOMElementSet[]): Component | any;
  element(tname: VDOMElementTName, ...chren: VDOMElementSet[]): Component | any;
  builder(): typeof vdom.element;
  builder(...tags: string[]): (typeof vdom.element)[];

  attr: Function;
  elementClose: Function;
  elementOpen: Function;
  elementOpenEnd: Function;
  elementOpenStart: Function;
  elementVoid: Function;
  text: Function;
};

export function ready(elem: Component, done: (c: Component) => void): void;

// DEPRECATED
// export var symbols: any;

export var prop: {
  create<T>(attr: PropOptions<any, T>): PropOptions<any, T> & ((attr: PropOptions<any, T>) => PropOptions<any, T>);

  number(attr?: PropOptions<any, number>): PropOptions<any, number>;
  boolean(attr?: PropOptions<any, boolean>): PropOptions<any, boolean>;
  string(attr?: PropOptions<any, string>): PropOptions<any, string>;
  array(attr?: PropOptions<any, any[]>): PropOptions<any, any[]>;
};

export function props(elem: Component, props?: any): void;
