import define from '@skatejs/define';
import SkMarked from '@skatejs/sk-marked';
import { Component, h } from '../utils';
import { Code } from './code';
import { Link, Note } from './primitives';

// Ensure they're defined so we can use them as HTML in the markdown renderers.
[Code, Link, Note].forEach(define);

const defaultRenderers = {
  blockquote(text) {
    return `<${Note.is}>${text}</${Note.is}>`;
  },
  code(code, lang) {
    return `<${Code.is} code="${code}" lang="${lang}"></${Code.is}>`;
  },
  heading(text, level) {
    return level === 1 ? '' : `<h${level}>${text}</h${level}>`;
  },
  link(href, title, text) {
    return `<${Link.is} href="${href}" title="${title}">${text}</${Link.is}>`;
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
        css={this.context.style}
        renderers={{
          ...defaultRenderers,
          ...renderers
        }}
        src={src}
      />
    );
  }
}
