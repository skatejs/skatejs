import { Key, HTMLProps } from './common';

export type ComponentProps<El, T> = {
  [P in keyof T]: PropOptions<El, T[P]>;
};

interface ComponentDefaultProps {
  children?: VDOMElement<any>[];
  key?: Key;
}

export interface StatelessComponent<Props> {
  (props: Props, children?: VDOMNode): VDOMElement<any>,
}
export type SFC<P> = StatelessComponent<P>;

interface ComponentClass<PropsType> {
  new (props?: PropsType): Component<PropsType>;
}
export class Component<Props> extends HTMLElement {
  // Special hack for own components type checking.
  // It works in combination with ElementAttributesProperty. It placed in jsx.d.ts.
  // more detail, see: https://www.typescriptlang.org/docs/handbook/jsx.html
  //               and https://github.com/skatejs/skatejs/pull/952#issuecomment-264500153
  _props: Props & ComponentDefaultProps;
  // this is not possible yet? ... without this we have to duplicate props definition with class props definition
  // [K in keyof Props]: Props[K],

  static readonly is: string;
  static readonly props: ComponentProps<any, any>;
  static readonly observedAttributes: string[];

  // Custom Elements v1
  connectedCallback(): void;
  disconnectedCallback(): void;
  attributeChangedCallback(name: string, oldValue: null | string, newValue: null | string): void;
  adoptedCallback(): void;

  // SkateJS life cycle
  updatedCallback(previousProps: { [nameOrSymbol: string]: any }): boolean | void;
  // NOTE: infering generics work only on instances, not on implementation type. So this will not give you type safety, you still have to manually annotate those props in your code
  renderCallback(props?: Props): VDOMElement<any> | VDOMElement<any>[] | null;
  renderedCallback(): void;

  // SkateJS DEPRECATED
  static created?(elem: Component<any>): void;
  static attached?(elem: Component<any>): void;
  static detached?(elem: Component<any>): void;
  static attributeChanged?(elem: Component<any>, data: { name: string, oldValue: null | string, newValue: null | string }): void;
  static updated(elem: Component<any>, prevProps: { [nameOrSymbol: string]: any }): boolean;
  static render?(elem: Component<any>): VDOMElement<any> | VDOMElement<any>[] | null;
  static rendered?(elem: Component<any>): void;
}


type AttributeReflectionBaseType = boolean | string;
type AttributeReflectionConfig = AttributeReflectionBaseType | {
  source?: AttributeReflectionBaseType,
  target?: AttributeReflectionBaseType
}
export interface PropOptions<El, T> {
  attribute?: AttributeReflectionConfig;
  coerce?: (value: any) => T | null | undefined;
  default?: T | null | undefined | ((elem: El, data: { name: string; }) => T | null | undefined);
  deserialize?: (value: string | null) => T | null | undefined;
  get?: <R>(elem: El, data: { name: string; internalValue: T; }) => R;
  initial?: T | null | undefined | ((elem: El, data: { name: string; }) => T | null | undefined);
  serialize?: (value: T | null | undefined) => string | null;
  set?: (elem: El, data: { name: string; newValue: T | null | undefined; oldValue: T | null | undefined; }) => void;
}

interface Define {
  <T extends Partial<HTMLElement>>(ctor: T): T;
  /**
   *  @Deprecated - will be removed in 5.0
   */
  <T extends Partial<HTMLElement>>(name: string, ctor: T): T;
}
/**
 * The define() function is syntactic sugar on top of customElements.define() that allows you to specify a static is property on your constructor that is the name of the component, or omit it altogether.
 */
export const define: Define;

export interface EmitOptions {
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
  detail?: any;
}

/**
 * Emits an Event on elem that is composed, bubbles and is cancelable by default.
 * The return value of emit() is the same as dispatchEvent().
 */
export function emit(elem: EventTarget, eventName: string, eventOptions?: EmitOptions): boolean;

export const h: typeof vdom.element;

export function link(elem: Component<any>, target?: string): (e: Event) => void;

export const prop: {
  create<T>(attr: PropOptions<any, T>): PropOptions<any, T> & ((attr: PropOptions<any, T>) => PropOptions<any, T>);

  number<E extends Component<any>, T extends number>(attr?: PropOptions<E, T>): PropOptions<E, T>;
  boolean<E extends Component<any>, T extends boolean>(attr?: PropOptions<E, T>): PropOptions<E, T>;
  string<E extends Component<any>, T extends string>(attr?: PropOptions<E, T>): PropOptions<E, T>;
  array<E extends Component<any>, T>(attr?: PropOptions<E, T[]>): PropOptions<E, T[]>;
  object<E extends Component<any>, T extends Object>(attr?: PropOptions<E, T>): PropOptions<E, T>;
};

/**
 * The props function is a getter or setter depending on if you specify the second argument.
 * If you do not provide props, then the current state of the component is returned.
 * If you pass props, then the current state of the component is set.
 * When you set state, the component will re-render synchronously only if it needs to be re-rendered.
 */
export function props<P>(elem: Component<P>): P;
export function props<P>(elem: Component<P>, props: Pick<Component<P>, '_props'>['_props']): void;

export function ready(elem: Component<any>, done: (c: Component<any>) => void): void;

// @DEPRECATED
// export const symbols: any;


//
// VDOM Nodes
// ----------------------------------------------------------------------

export interface VDOMElement<P> {
  type: VDOMElementType<P>;
  props: P;
  key: Key | null;
}
type VDOMText = string | number;
type VDOMChild = VDOMElement<any> | VDOMText;

// Should be Array<VDOMNode> but type aliases cannot be recursive
type VDOMFragment = {} | Array<VDOMChild | any[] | boolean>;
type VDOMNode = VDOMChild | VDOMFragment | boolean | null | undefined;

type VDOMElementType<P> = string | { id: string } | ComponentClass<P> | SFC<P>;

export const vdom: {

  element<P>(type: VDOMElementType<P>, attrs?: HTMLProps<HTMLElement> | P, ...children: VDOMChild[]): VDOMElement<any>,
  element<P>(type: VDOMElementType<P>, ...children: VDOMChild[]): VDOMElement<any>,

  builder(): typeof vdom.element;
  builder(...tags: string[]): ((attrs?: HTMLProps<HTMLElement>, ...children: VDOMChild[]) => VDOMElement<any>)[];

  attr(...args: any[]): void;
  elementClose: Function;
  elementOpen: Function;
  elementOpenEnd: Function;
  elementOpenStart: Function;
  elementVoid: Function;
  text: Function;
};
