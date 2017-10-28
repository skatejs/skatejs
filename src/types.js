// @flow

// Generic
export type DeepObject = { [string]: Object };

// Custom elements
export type CustomElement = HTMLElement & {
  is?: string,
  observedAttributes?: Array<string>,
  prototype: {
    attributeChangedCallback?: (
      name: string,
      oldValue: any,
      newValue: any
    ) => void,
    connectedCallback?: () => void,
    disconnectedCallback?: () => void
  }
};
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

// Mixins
export type WithChildren = CustomElement & {
  prototype: {
    childrenDidUpdate?: ?Function
  }
};
export type WithContext = CustomElement & {
  prototype: {
    context: any
  }
};
export type WithLifecycle = CustomElement & {
  prototype: {
    didMount?: ?Function,
    didUnmount?: ?Function,
    willMount?: ?Function,
    willUnmount?: ?Function
  }
};
export type WithProps = CustomElement & {
  props: PropTypes,
  prototype: {
    didUpdate?: ?Function,
    props: Object,
    shouldUpdate: (props: Object) => boolean,
    triggerUpdate: Function,
    willUpdate?: ?(props: Object) => void
  }
};
export type WithRenderer = CustomElement & {
  prototype: {
    didRender?: ?Function,
    didUpdate: Function,
    render?: ?Function,
    renderer?: ?Function,
    willRender?: ?Function
  }
};
export type WithState = CustomElement & {
  prototype: {
    state: Object
  }
};
export type WithUnique = CustomElement & {
  is?: ?string
};
export type WithComponent =
  | WithChildren
  | WithContext
  | WithLifecycle
  | WithProps
  | WithRenderer
  | WithState
  | WithUnique;
