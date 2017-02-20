// UMD library
export as namespace skate;

// empty reexport so user get's JSX to global
export { } from './ts-typings/jsx';

// Public API
export {
  Component,
  ComponentProps,
  PropOptions,
  StatelessComponent,
  SFC,
  prop,
  props,
  ready,
  link,
  define,
  emit,
  h,
  vdom
} from './ts-typings/api';
