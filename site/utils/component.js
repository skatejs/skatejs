// @flow

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
      // $FlowFixMe - host
      while ((node = node.parentNode || node.host)) {
        if ('context' in node) {
          // $FlowFixMe - context
          return node.context;
        }
      }
      return {};
    }
    set context(context: *) {
      // $FlowFixMe - _context
      this._context = context;
    }
  };

export const Component = class extends withContext(
  withComponent(withLitHtml(HTMLElement))
) {
  $ = html;
  context: {
    style: string
  };
  get $style(): string {
    return style(this.context.style, value(...Object.values(this.css || {})));
  }
};
