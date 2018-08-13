import { Component as SkateComponent } from 'skatejs';
import renderer from '@skatejs/renderer-lit-html';
import { value } from 'yocss';
import { html } from './html';
import { style } from './style';

export const Component = class extends SkateComponent {
  $ = html;
  _context: any;
  renderer = renderer;
  get $style(): string {
    // @ts-ignore
    return style(this.context.style, value(...Object.values(this.css || {})));
  }
  get context() {
    if (this._context) {
      return this._context;
    }
    let node = this;
    // @ts-ignore
    while ((node = node.parentNode || node.host)) {
      if ('context' in node) {
        return node.context;
      }
    }
    return {};
  }
  set context(context: any) {
    this._context = context;
  }
};
