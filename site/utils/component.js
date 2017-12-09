import { withComponent } from 'skatejs';
import withLitHtml from '@skatejs/renderer-lit-html';
import { value } from 'yocss';
import { html } from './html';
import { style } from './style';

export const Component = class extends withComponent(withLitHtml()) {
  $ = html;
  get $style() {
    return style(this.context.style, value(...Object.values(this.css || {})));
  }
};
