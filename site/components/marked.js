// @jsx h

import { define, props } from 'skatejs';
import SkMarked from '@skatejs/sk-marked';
import { Component, h } from '../utils';
import { Code } from './code';
import { Link } from './primitives';

function tag(ctor, attr, html) {
  return `<${ctor.is}${Object.keys(attr).reduce(
    (p, c) => p + ` ${c}="${attr[c]}"`,
    ''
  )}>${html}</${ctor.is}>`;
}

export const Marked = define(
  class Marked extends Component {
    static props = {
      src: props.string
    };
    render({ src }) {
      return (
        <SkMarked.is
          css={this.context.style}
          renderers={{
            code(code, lang) {
              return tag(Code, { code, lang });
            },
            link(href, title, text) {
              return tag(Link, { href, title }, text);
            }
          }}
          src={src}
        />
      );
    }
  }
);
