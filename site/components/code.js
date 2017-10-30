import hljs from 'highlight.js';
import theme from 'raw-loader!highlight.js/styles/monokai.css';
import { define, props } from '../../src';
import { Component, h } from '../utils';
import { Tabs } from './tabs';

function format(src) {
  src = src || '';

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
    props: {
      code: string,
      lang: string,
      title: string
    };
    props = {
      code: '',
      lang: 'js'
    };
    render({ code, lang, title }) {
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
              padding: 10px 12px;
            }
            .hljs {
              background-color: transparent;
              font-family: monaco;
              font-size: .7em;
              font-weight: lighter;
              line-height: 1.6em;
              overflow: auto;
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
            <pre
              class={`hljs ${lang}`}
              ref={e => e && (e.innerHTML = format(code))}
            />
          </div>
        </div>
      );
    }
  }
);

export const Example = define(
  class Example extends Component {
    props: {
      html: string,
      title: string
    };
    renderer(root) {
      root.innerHTML = `
        <style>
          :host {
            display: block;
          }
          .code {
            background-color: #292D34;
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
        ${this.title ? `<div class="title">${this.title}</div>` : ''}
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
    render({ code, html }) {
      return (
        <Tabs.is
          css={`
            .tabs {
              border-bottom: none;
            }
            .tabs a {
              border-bottom: none;
            }
            .tabs a[selected],
            .tabs a:hover {
              background-color: #292D34;
              border-bottom: none;
              color: #eee;
            }
          `}
          items={[
            {
              name: 'Code',
              pane: <Code.is code={code} lang="js" />
            },
            {
              name: 'HTML',
              pane: html ? <Code.is code={html} lang="html" /> : ''
            },
            {
              name: 'Result',
              pane: html ? <Example.is html={html} /> : ''
            }
          ]}
        >
          <style>{`
            :host {
              display: block;
            }
          `}</style>
        </Tabs.is>
      );
    }
  }
);
