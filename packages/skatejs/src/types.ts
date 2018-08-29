export interface CustomElement extends HTMLElement {
  attributeChangedCallback?(name: string, oldValue: string, newValue: string);
  childrenUpdated?();
  connectedCallback?();
  disconnectedCallback?();
  forceUpdate?();
  props?: Props;
  render?();
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
}

export type DenormalizedPropType = {
  changed?:
    | void
    | ((elem: HTMLElement, name: string, oldValue: any, newValue: any) => void);
  defined?: void | ((ctor: CustomElementConstructor, name: string) => void);
  deserialize?: void | ((string) => any);
  serialize?: void | ((any) => string | void);
  source?: string | void | ((name: string) => string | void);
  target?: string | void | ((name: string) => string | void);
  [s: string]: any;
};

export type NormalizedPropType = {
  changed: ((
    elem: HTMLElement,
    name: string,
    oldValue: any,
    newValue: any
  ) => void);
  defined: ((ctor: CustomElementConstructor, name: string) => void);
  deserialize: (string) => any;
  serialize: (any) => string | void;
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
