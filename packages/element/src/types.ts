export interface CustomElement {
  attributeChangedCallback?(name: string, oldValue: string, newValue: string);
  childrenUpdated?();
  connectedCallback?();
  disconnectedCallback?();
  forceUpdate?();
  props?: Props;
  render?(...args);
  rendered?(props: Props);
  renderer?(root: Root, func: () => any);
  renderRoot?: Root;
  shouldRender?(props: Props): boolean;
  updated?(props: Props);
}

export interface CustomElementConstructor {
  new (): CustomElement;
  is?: string;
  observedAttributes?: Array<string>;
  name: string;
  props?: {};
  shadowRootOptions?: ShadowRootInit;
}

export type PropTypeDefault = (
  elem: CustomElement,
  name: string,
  oldValue: any
) => any;

export type PropTypeDefined = (
  ctor: CustomElementConstructor,
  name: string
) => void;

export type PropTypeDeserialize = (
  elem: CustomElement,
  name: string,
  oldValue: any,
  newValue: any
) => any;

export type PropTypeGet = (
  elem: CustomElement,
  name: string,
  oldValue: any
) => any;

export type PropTypeSerialize = (
  elem: CustomElement,
  name: string,
  oldValue: any,
  newValue: any
) => string | void;

export type PropTypeSet = (
  elem: HTMLElement,
  name: string,
  oldValue: any,
  newValue: any
) => void;

export type PropTypeSource = (name: string) => string | void;

export type PropTypeTarget = (name: string) => string | void;

export type DenormalizedPropType = {
  default?: PropTypeDefault;
  defined?: PropTypeDefined;
  deserialize?: PropTypeDeserialize;
  get?: PropTypeGet;
  serialize?: PropTypeSerialize;
  set?: PropTypeSet;
  source?: string | PropTypeSource;
  target?: string | PropTypeTarget;
  [s: string]: any;
};

export type NormalizedPropType = {
  default: PropTypeDefault;
  defined: PropTypeDefined;
  deserialize: PropTypeDeserialize;
  get: PropTypeGet;
  serialize: PropTypeSerialize;
  set: PropTypeSet;
  source: string | void;
  target: string | void;
  [s: string]: any;
};

export type NormalizedPropTypes = Array<{
  propName: string;
  propType: NormalizedPropType;
}>;

export type ObservedAttributes = Array<string>;

export type Props = {
  [s: string]: any;
};

export type PropType =
  | ArrayConstructor
  | BooleanConstructor
  | NumberConstructor
  | ObjectConstructor
  | StringConstructor
  | DenormalizedPropType;

export type PropTypes = {
  [s: string]: PropType;
};

export type Root = HTMLElement | ShadowRoot;
