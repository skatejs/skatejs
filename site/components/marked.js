// @jsx h

import '@skatejs/sk-marked';
import './code';
import './primitives';

import { define, props } from 'skatejs';
import { Component } from '../utils';

export const Marked = define(
  class Marked extends Component {
    static props = {
      src: props.string
    };
    render({ src }) {
      return this.$`
        <sk-marked
          css="${this.context.style}"
          renderers="${{
            code(code, lang) {
              return `<x-code code="${code}" lang="${lang}"></x-code>`;
            },
            link(href, title, text) {
              return `<x-link href="${href}" title="${title}">${text}</x-link>`;
            }
          }}"
          src="${src}"
        ></sk-marked>
      `;
    }
  }
);
