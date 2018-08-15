import { Component as SkateComponent } from 'skatejs';
import renderer from '@skatejs/renderer-preact';
import { value } from 'yocss';
import { style } from './style';

export const Component = class extends SkateComponent {
  _context: any;
  renderer = renderer;
  get $style(): string {
    // @ts-ignore
    return style(value(this.context.style), value(this.css));
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
