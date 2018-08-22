import SkMarked from '@skatejs/sk-marked';
import { define, name } from 'skatejs';
import { Component, h } from '../utils';
import { Code } from './code';
import { Link } from './primitives';

const CustomCode = define(
  class extends Code {
    static is = name();
  }
);

const CustomLink = define(
  class extends Link {
    static is = name();
  }
);

const defaultRenderers = {
  code(code, lang) {
    return `<${CustomCode.is} code="${code}" lang="${lang}"></${
      CustomCode.is
    }>`;
  },
  link(href, title, text) {
    return `<${CustomLink.is} href="${href}" title="${title}">${text}</${
      CustomLink.is
    }>`;
  }
};

export class Marked extends Component {
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
