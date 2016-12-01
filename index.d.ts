export { } from "./jsx";

export as namespace skate;

export interface HasProps<El extends Component> {
  props: { [key: string]: skate.PropAttr<El, any>; };
}

export interface OnUpdatedCallback {
  updatedCallback(previousProps: any): boolean | undefined | void;
}

export interface OnRenderCallback {
  renderCallback(): any;
}

export interface OnRenderedCallback {
  renderedCallback(): void;
}

export class Component extends HTMLElement {
  // static readonly props: { [name: string]: PropAttr<Component, any> };
  static readonly observedAttributes: string[];

  // Custom Elements v1
  connectedCallback(): void;
  disconnectedCallback(): void;
  attributeChangedCallback(name: string, oldValue: any, newValue: any): void;

  // SkateJS
  updated(prev: any): boolean;
}

export interface PropAttr<El, T> {
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

export interface EmitOpts {
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
  detail?: any;
}
export function emit(elem: EventTarget, name: string, opts?: EmitOpts): void;

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
  create<T>(attr: PropAttr<any, T>): PropAttr<any, T> & ((attr: PropAttr<any, T>) => PropAttr<any, T>);

  number(attr?: PropAttr<any, number>): PropAttr<any, number>;
  boolean(attr?: PropAttr<any, boolean>): PropAttr<any, boolean>;
  string(attr?: PropAttr<any, string>): PropAttr<any, string>;
  array(attr?: PropAttr<any, any[]>): PropAttr<any, any[]>;
};

export function props(elem: Component, props?: any): void;
