import define, { getName } from '@skatejs/define';
import SkMarked from '@skatejs/sk-marked';
import { Component, h } from '../utils';
import { Code } from './code';
import { Link, Note } from './primitives';

// Ensure they're defined so we can use them as HTML in the markdown renderers.
const custom = {
  code: () => getName(define(Code)),
  link: () => getName(define(Link)),
  note: () => getName(define(Note))
};

const defaultRenderers = {
  blockquote(text) {
    return `<${custom.note()}>${text}</${custom.note()}>`;
  },
  code(code, lang) {
    return `<${custom.code()} lang="${lang}">${code}</${custom.code()}>`;
  },
  heading(text, level) {
    return level === 1 ? '' : `<h${level}>${text}</h${level}>`;
  },
  link(href, title, text) {
    return `<${custom.link()} href="${href}" title="${title}">${text}</${custom.link()}>`;
  }
};

export class Marked extends Component {
  static props = {
    renderers: Object,
    src: String
  };
  renderers: Object = {};
  src: string = '';
  render() {
    const { renderers, src } = this;
    return (
      <SkMarked
        css={this.getStyle()}
        renderers={{
          ...defaultRenderers,
          ...renderers
        }}
        src={src}
      />
    );
  }
}
