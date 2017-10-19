/** @jsx h */

import withPreact from '@skatejs/renderer-preact/umd';
import val from '@skatejs/val';
import hljs from 'highlight.js';
import { h as preactH } from 'preact';

import { define, props, withComponent } from '../../src';

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

export const Hero = define(
  class Hero extends Component {
    renderCallback() {
      return (
        <div className="hero">
          <style>{`
            .hero {
              margin: 50px 0;
              text-align: center;
            }
            .title {
              margin-bottom: 50px;
            }
          `}</style>
          <img
            attrs={{
              height: 100,
              src: 'https://cdn.rawgit.com/skatejs/branding/1efc884e/icon.png'
            }}
          />
          <h1 className="title">SkateJS</h1>
          <h2>Web components for all your favourite view libraries.</h2>
        </div>
      );
    }
  }
);

export const Layout = define(
  class Layout extends Component {
    renderCallback() {
      return (
        <div className="outer">
          <style>{`
            body {
              background-color: #F2F5EB;
              font-family: Helvetica;
              margin: 0;
              padding: 0;
            }
            h1 {
              font-size: 3em;
              margin: 10px 0;
            }
            h2 {
              font-size: 2em;
              font-weight: 100;
              margin: 10px 0;
            }
            .outer {
              border-top: 5px solid #F2567C;
              padding: 25px;
            }
            .inner {
              max-width: 800px;
              margin: 0 auto;
            }
          `}</style>
          <div className="inner">
            <slot />
          </div>
        </div>
      );
    }
  }
);
