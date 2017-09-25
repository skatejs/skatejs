import {
  ComposedCustomEvent,
  Constructor,
  CustomElement,
  HTMLElementClass,
  EventOptions,
  PropOptions,
  WithUnique,
  WithChildren,
  WithRenderer,
  WithUpdate,
  WithComponent,
  WithLifecycle,
  WithContext,
  Mixed,
} from './types';

/**
 * The define() function is syntactic sugar on top of customElements.define()
 * that allows you to specify a static is property on your constructor that is the name of the component,
 * or omit it altogether.
 */
export const define: <T extends HTMLElementClass>(ctor: T) => T;

/**
 * Emits an Event on elem that is composed, bubbles and is cancelable by default.
 * The return value of emit() is the same as dispatchEvent().
 */
export function emit(elem: EventTarget | HTMLElementClass, eventName: string, eventOptions?: EventOptions): boolean;

export function link(elem: CustomElement, target: string): (e: ComposedCustomEvent) => void;

export const props: Readonly<{
  any: PropOptions & PropertyDecorator;
  array: PropOptions & PropertyDecorator;
  boolean: PropOptions & PropertyDecorator;
  number: PropOptions & PropertyDecorator;
  object: PropOptions & PropertyDecorator;
  string: PropOptions & PropertyDecorator;
}>;

export const prop: (ops?: PropOptions) => PropertyDecorator & PropOptions;

export const shadow: (elem: CustomElement, opts?: ShadowRootInit) => ShadowRoot;

// Mixins
export function withComponent<T extends Constructor<HTMLElement> = Constructor<HTMLElement>>(
  Base?: T
): typeof WithComponent;
export function withUpdate<P = Mixed, S = Mixed, T extends Constructor<HTMLElement> = Constructor<HTMLElement>>(
  Base?: T
): Constructor<WithUpdate<P, S>> & T;
export function withRenderer<T extends Constructor<HTMLElement> = Constructor<HTMLElement>>(
  Base?: T
): Constructor<WithRenderer> & T;
export function withLifecycle<T extends Constructor<HTMLElement> = Constructor<HTMLElement>>(
  Base?: T
): Constructor<WithLifecycle> & T;
export function withContext<T extends Constructor<HTMLElement> = Constructor<HTMLElement>>(
  Base?: T
): Constructor<WithContext> & T;
export function withChildren<T extends Constructor<HTMLElement> = Constructor<HTMLElement>>(
  Base?: T
): Constructor<WithChildren> & T;
export function withUnique<T extends Constructor<HTMLElement> = Constructor<HTMLElement>>(
  Base?: T
): Constructor<WithUnique> & T;
