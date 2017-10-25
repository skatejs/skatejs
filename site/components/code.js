import hljs from 'highlight.js';
import theme from 'raw-loader!highlight.js/styles/monokai.css';
import { define, props } from '../../src';
import { Component, h } from '../utils';

function format(src) {
  // Fix imports.
  src = src.replace('../../../src', 'skatejs').replace(/\/umd/, '');

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
      lang: props.string,
      title: props.string
    };
    props = {
      code: '',
      lang: 'js'
    };
    renderCallback({ code, lang, title }) {
      return (
        <div>
          <style>{`
            ${theme}
            :host {
              display: block;
            }
            .code {
              background-color: #292D34;
              margin: 0;
              overflow: auto;
              padding: 10px 14px;
            }
            .hljs {
              background-color: transparent;
              font-size: 1em;
              line-height: 1.2em;
            }
            .title {
              background-color: #20232A;
              font-size: .8em;
              padding: 10px 20px;
            }
            .code, .title {
              color: #eee;
            }
            pre {
              margin: 0;
            }
          `}</style>
          {title ? <div class="title">{title}</div> : null}
          <div class="code">
            <pre>
              <code
                class={`hljs ${lang}`}
                ref={e => e && (e.innerHTML = format(code))}
              />
            </pre>
          </div>
        </div>
      );
    }
  }
);

export const Example = define(
  class Example extends Component {
    static props = {
      html: props.string,
      title: props.string
    };
    rendererCallback(renderRoot) {
      renderRoot.innerHTML = `
        <style>
          :host {
            display: block;
          }
          .code {
            background-color: #333;
            color: white;
            margin: 0;
            overflow: auto;
            padding: 20px 28px;
          }
          .title {
            background-color: #20232A;
            color: #eee;
            font-size: .8em;
            padding: 10px 20px;
          }
        </style>
        <div class="title">${this.title}</div>
        <div class="code">${this.html}</div>
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
          `}</style>
          <Code.is code={code} lang="js" />
          {html
            ? [
                <Code.is code={html} lang="html" title="HTML" />,
                <Example.is html={html} title="Result" />
              ]
            : ''}
        </div>
      );
    }
  }
);
