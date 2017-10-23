import hljs from 'highlight.js';
import theme from 'raw-loader!highlight.js/styles/monokai.css';
import { define, props } from '../../src';
import { Component, h } from '../utils';

function format(src) {
  // Fix Skate imports.
  src = src.replace('../../../src', 'skatejs');

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
  class Code extends Component {
    static props = {
      code: props.string,
      lang: props.string
    };
    props = {
      code: '',
      lang: 'js'
    };
    renderCallback({ code, lang, themePath }) {
      return (
        <pre>
          <style>{`
            ${theme}
            :host {
              background-color: #333;
              color: white;
              display: block;
              margin: 0;
              overflow: auto;
              padding: 1px 20px;
            }
            .hljs {
              background-color: transparent;
              line-height: 1.2em;
              font-size: 1em;
            }
          `}</style>
          <code
            class={`hljs ${lang}`}
            ref={e => e && (e.innerHTML = format(code))}
          />
        </pre>
      );
    }
  }
);

export const Example = define(
  class Example extends Component {
    static props = {
      html: props.string
    };
    rendererCallback(renderRoot) {
      renderRoot.innerHTML = `
        <style>
          :host {
            background-color: #333;
            color: white;
            display: block;
            margin: 0;
            overflow: auto;
            padding: 20px 28px;
          }
        </style>
        ${this.html}
      `;
    }
  }
);

export const Runnable = define(
  class Runnable extends Component {
    static props = {
      code: null,
      html: null
    };
    renderCallback({ code, html }) {
      return (
        <div class="edge">
          <style>{`
            :host {
              display: block;
            }
            .edge {
              border-radius: 3px;
              overflow: hidden;
            }
            .hr {
              border-bottom: 1px solid #555;
            }
          `}</style>
          <Code.is code={code} lang="js" />
          {html
            ? [
                <div class="hr" />,
                <Code.is code={html} lang="html" />,
                <div class="hr" />,
                <Example.is html={html} />
              ]
            : ''}
        </div>
      );
    }
  }
);
