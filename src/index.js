import * as Mixins from './api/mixins';
import * as prop from './api/prop';
import * as vdom from './api/vdom';
import Component from './api/component';
import define from './api/define';
import emit from './api/emit';
import link from './api/link';
import props from './api/props';

const { h } = vdom;

export {
  Component,
  define,
  emit,
  h,
  link,
  Mixins,
  prop,
  props,
  vdom
};
