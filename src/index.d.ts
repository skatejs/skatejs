// UMD library
export as namespace skate;

// Public API
export {
  Component,
  ComponentProps,
  PropOptions,
  StatelessComponent,
  SFC,
  getProps,
  setProps,
  propString,
  propObject,
  propBoolean,
  propNumber,
  propArray,
  link,
  define,
  emit
} from './ts-typings/api';

export { h } from 'preact';