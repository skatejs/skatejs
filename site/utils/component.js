import { withComponent } from 'skatejs';
import withLitHtml from '@skatejs/renderer-lit-html';
import { value } from 'yocss';
import { html } from './html';
import { style } from './style';

const withContext = (Base = HTMLElement) =>
  class extends Base {
    get context() {
      if (this._context) {
        return this._context;
      }
      let node = this;
      while ((node = node.parentNode || node.host)) {
        if ('context' in node) {
          return node.context;
        }
      }
      return {};
    }
    set context(context) {
      this._context = context;
    }
  };

export const Component = class extends withContext(
  withComponent(withLitHtml(HTMLElement))
) {
  $ = html;
  get $style() {
    return style(this.context.style, value(...Object.values(this.css || {})));
  }
};
