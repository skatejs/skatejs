import * as prop from './api/prop';
import * as symbols from './api/symbols';
import * as vdom from './api/vdom';
import Component from './api/component';
import define from './api/define';
import emit from './api/emit';
import link from './api/link';
import props from './api/props';
import ready from './api/ready';

const h = vdom.builder();

export {
  Component,
  define,
  emit,
  h,
  link,
  prop,
  props,
  ready,
  symbols,
  vdom
};
