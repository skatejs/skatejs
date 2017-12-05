import '@skatejs/sk-marked';
import './code';
import './primitives';

import { define, props } from 'skatejs';
import { Component } from '../utils';

const defaultRenderers = {
  code(code, lang) {
    return `<x-code code="${code}" lang="${lang}"></x-code>`;
  },
  link(href, title, text) {
    return `<x-link href="${href}" title="${title}">${text}</x-link>`;
  }
};

@define
export class Marked extends Component {
  static is = 'x-marked';
  static props = {
    renderers: props.object,
    src: props.string
  };
  render({ renderers, src }) {
    return this.$`
      <sk-marked
        css="${this.context.style}"
        renderers="${{
          ...defaultRenderers,
          ...renderers
        }}"
        src="${src}"
      ></sk-marked>
    `;
  }
}
