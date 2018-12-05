import { Component as SkateComponent } from '@skatejs/component';
import renderer from '@skatejs/renderer-preact';
import { value } from 'yocss';
import { style } from './style';

export { h } from '@skatejs/renderer-preact';
export class Component extends SkateComponent {
  _context: any;
  css: any;
  state = {};
  get $style(): string {
    // @ts-ignore
    return style(
      value(this.context.style),
      // @ts-ignore
      value(...Object.values(this.css || {}))
    );
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
  renderer(root, func) {
    renderer(root, func);
  }
}
