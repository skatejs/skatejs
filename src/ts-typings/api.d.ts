type Key = string | number;

export type ComponentProps<El, T> = {
  [P in keyof T]: PropOptions;
};

interface ComponentDefaultProps {
  children?: JSX.Element[];
  key?: Key;
}

export interface StatelessComponent<Props> {
  (props: Props, children?: JSX.Element[]): JSX.Element,
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
  // NOTE: inferring generics work only on instances, not on implementation type. So this will not give you type safety, you still have to manually annotate those props in your code
  renderCallback(props?: Props): JSX.Element | null;
  renderedCallback(): void;

  // SkateJS DEPRECATED
  static created?(elem: Component<any>): void;
  static attached?(elem: Component<any>): void;
  static detached?(elem: Component<any>): void;
  static attributeChanged?(elem: Component<any>, data: { name: string, oldValue: null | string, newValue: null | string }): void;
  static updated(elem: Component<any>, prevProps: { [nameOrSymbol: string]: any }): boolean;
  static render?(elem: Component<any>): JSX.Element | null;
  static rendered?(elem: Component<any>): void;
}


type AttributeReflectionBaseType = boolean | string;
type AttributeReflectionConfig = AttributeReflectionBaseType | {
  source?: AttributeReflectionBaseType,
  target?: AttributeReflectionBaseType
}
export interface PropOptions {
  attribute?: AttributeReflectionConfig;
  coerce?: <T>(value: any) => T | null | undefined;
  default?: any | ((elem: HTMLElement, data: { name: string; }) => any);
  deserialize?: <T>(value: string | null) => T | null | undefined;
  initial?: any | ((elem: HTMLElement, data: { name: string; }) => any);
  serialize?: <T>(value: T | null | undefined) => string | null;
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

export function link(elem: Component<any>, target?: string): (e: Event) => void;

export const propString: PropOptions;
export const propNumber: PropOptions;
export const propBoolean: PropOptions;
export const propArray: PropOptions;
export const propObject: PropOptions;

/**
 * The props function is a getter or setter depending on if you specify the second argument.
 * If you do not provide props, then the current state of the component is returned.
 * If you pass props, then the current state of the component is set.
 * When you set state, the component will re-render synchronously only if it needs to be re-rendered.
 */
export function getProps<P>(elem: Component<P>): P;
export function setProps<P>(elem: Component<P>, props: Pick<Component<P>, '_props'>['_props']): void;

