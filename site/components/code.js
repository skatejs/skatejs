import hljs from 'highlight.js';
import { Component, h, style, withRehydration } from '../utils';
import { define, props } from '../../src';

function format(src) {
  // Remove leading newlines and only allow up to two newlines in code.
  src = src.split('\n').filter((v, i, a) => a[i - 1] || v.trim().length);

  // Get the initial indent so we can remove it from subsequent lines.
  const indent = src[0] ? src[0].match(/^\s*/)[0].length : 0;

  // Format indentation.
  src = src.map(s => s.substring(indent));

  // Re-instate newline formatting.
  return hljs.highlightAuto(src.join('\n')).value;
}

export const Code = define(
  class Code extends withRehydration(Component) {
    static props = {
      code: props.string,
      lang: props.string,
      theme: props.string,
      themePath: props.string
    };
    props = {
      code: '',
      lang: 'js',
      theme: 'monokai',
      themePath: '../node_modules/highlight.js/styles'
    };
    renderCallback({ code, lang, theme, themePath }) {
      return (
        <pre>
          <link rel="stylesheet" href={`${themePath}/${theme}.css`} />
          {style(
            this,
            `
            :host {
              background-color: #333;
              color: white;
              display: block;
              margin: 0;
              padding: 1px 20px;
            }
            .hljs {
              background-color: transparent;
              line-height: 1.2em;
              font-size: 1em;
            }
          `
          )}
          <code
            class={`hljs ${lang}`}
            ref={e => e && (e.innerHTML = format(code))}
          />
        </pre>
      );
    }
  }
);
