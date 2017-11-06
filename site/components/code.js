import { define, props } from '../../src';
import { Component, h, withLoadableStyle } from '../utils';
import { Tabs } from './tabs';

function format(src) {
  src = src || '';

  // Fix imports.
  src = src.replace(/(\.\.\/)*src/, 'skatejs').replace(/\/umd/, '');

  // Remove leading newlines and only allow up to two newlines in code.
  src = src.split('\n').filter((v, i, a) => a[i - 1] || v.trim().length);

  // Get the initial indent so we can remove it from subsequent lines.
  const indent = src[0] ? src[0].match(/^\s*/)[0].length : 0;

  // Format indentation.
  src = src.map(s => s.substring(indent));

  // Re-instate newline formatting.
  src = src.join('\n');

  return src;
}

function highlight(elem, code, language) {
  import('worker-loader!prismjs').then(Prism => {
    const prism = new Prism();
    prism.onmessage = e => {
      elem.innerHTML = e.data;
    };
    prism.postMessage(
      JSON.stringify({
        code,
        language
      })
    );
  });
}

const Theme = withLoadableStyle({
  loader: () => import('raw-loader!prismjs/themes/prism-twilight.css')
});

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
          <Theme.is />
          <style>{`
            :host {
              display: block;
            }
            .code {
              background-color: #292D34;
              margin: 0;
              overflow: auto;
              padding: 10px 12px;
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
              ref={e => {
                if (!e) return;
                code = format(code);
                e.innerHTML = code;
                highlight(e, code, lang);
              }}
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
