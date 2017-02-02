import * as prop from './api/prop';
import * as symbols from './api/symbols';
import * as vdom from './api/vdom';
import Component from './api/component';
import Element from './api/element';
import define from './api/define';
import emit from './api/emit';
import link from './api/link';
import props from './api/props';

const h = vdom.builder();

export {
  Component,
  Element,
  define,
  emit,
  h,
  link,
  prop,
  props,
  symbols,
  vdom
};
