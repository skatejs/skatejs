import Element from '@skatejs/element-preact';
import { value } from 'yocss';
import { style } from './style';

export { h } from 'preact';
export class Component extends Element {
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
}
