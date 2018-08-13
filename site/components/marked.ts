import { define } from 'skatejs';
import '@skatejs/sk-marked';
import { Component } from '../utils';
import './code';
import './primitives';

const defaultRenderers = {
  code(code, lang) {
    return `<x-code code="${code}" lang="${lang}"></x-code>`;
  },
  link(href, title, text) {
    return `<x-link href="${href}" title="${title}">${text}</x-link>`;
  }
};

export const Marked = define(
  class extends Component {
    static is = 'x-marked';
    renderers: Object = {};
    src: string = '';
    render() {
      const { renderers, src } = this;
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
);
