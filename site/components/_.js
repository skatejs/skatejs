/** @jsx h */

import withPreact from '@skatejs/renderer-preact/umd';
import val from '@skatejs/val';
import hljs from 'highlight.js';
import { h as preactH } from 'preact';

import { define, props, withComponent } from '../..';

const fs = require('fs');

export const Component = withComponent(withPreact());
export const h = val(preactH);

function format(src) {
  // For some reason we can't do this after formatting so it loses syntax
  // highlighting.
  src = src.replace(/</gm, '&lt;').replace(/>/gm, '&gt;');

  // Remove leading newlines and only allow up to two newlines in code.
  src = src.split('\n').filter((v, i, a) => a[i - 1] || v.trim().length);

  // Get the initial indent so we can remove it from subsequent lines.
  const indent = src[0].match(/^\s*/)[0].length;

  // Format indentation.
  src = src.map(s => s.substring(indent));

  // Re-instate newline formatting.
  return hljs.highlightAuto(src.join('\n')).value;
}

export const Code = define(
  class Code extends Component {
    static props = {
      lang: { ...props.string, ...{ default: 'js' } },
      src: props.string,
      theme: { ...props.string, ...{ default: 'monokai' } }
    };
    renderCallback({ lang, src, theme }) {
      return (
        <pre>
          <style>{`
            .host {
              background-color: #222;
              color: white;
              display: block;
              padding: 10px;
            }
            ${fs.readFileSync(
              `./node_modules/highlight.js/styles/${theme}.css`
            )}
          `}</style>
          <div className="host">
            <code
              className={`hljs ${lang}`}
              ref={e => e && (e.innerHTML = format(src))}
            />
          </div>
        </pre>
      );
    }
  }
);

export const Heading = ({ children }) =>
  <h1>
    {children}
  </h1>;

export const Hero = define(
  class Hero extends Component {
    renderCallback() {
      return (
        <div>
          <slot />
        </div>
      );
    }
  }
);

export const Layout = define(
  class Layout extends Component {
    renderCallback() {
      return <slot />;
    }
  }
);
