import SkateComponent from '@skatejs/core';
import { readFileSync } from 'fs';
import css, { value } from 'yocss';
import { Component, h } from '../utils/component';
import { Tabs } from './tabs';

const mapLang = {};
// @ts-ignore;
const values = obj => Object.values(obj);

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

// function highlight(elem, code, language) {
//   import('prismjs').then(Prism => {
//     const prism = new Prism();
//     prism.onmessage = e => {
//       elem.innerHTML = e.data;
//     };
//     prism.postMessage(
//       JSON.stringify({
//         code,
//         language
//       })
//     );
//   });
// }

const cssCode = {
  code: css({
    backgroundColor: '#292D34',
    color: '#eee',
    margin: 0,
    overflow: 'auto',
    padding: '20px'
  }),
  pre: css({
    margin: 0
  }),
  title: css({
    backgroundColor: '#20232A',
    color: '#eee',
    fontSize: '.8em',
    padding: '10px 20px'
  })
};

export class Code extends Component {
  static props = {
    code: String,
    lang: String,
    title: String
  };
  code: string = '';
  css = cssCode;
  lang: string = '';
  title: string = '';
  connectedCallback() {
    super.connectedCallback();
    this.style.display = 'block';
  }
  render() {
    return (
      <div>
        <style>
          ${readFileSync(
            __dirname + '/../node_modules/prismjs/themes/prism-twilight.css'
          )}
        </style>
        {this.$style}
        {this.title ? <div class={cssCode.title}>{this.title}</div> : null}
        <div class={cssCode.code}>
          <pre class={cssCode.pre}>{format(this.code)}</pre>
        </div>
      </div>
    );
  }
}

const cssExample = {
  code: css({
    backgroundColor: '#292D34',
    color: 'white',
    margin: 0,
    overflow: 'auto',
    padding: '20px'
  }),
  title: css({
    backgroundColor: '#20232A',
    color: '#eee',
    fontSize: '.8em',
    padding: '10px 20px'
  })
};

export class Example extends SkateComponent {
  static props = {
    html: String,
    title: String
  };
  html: string = '';
  title: string = '';
  connectedCallback() {
    super.connectedCallback();
    this.style.display = 'block';
  }
  render() {
    return `
      <style>${value(...values(cssExample))}</style>
      ${
        this.title ? `<div class="${cssExample.title}">${this.title}</div>` : ''
      }
      <div class="${cssExample.code}">${this.html}</div>
    `;
  }
}

export class Runnable extends Component {
  static props = {
    code: String,
    html: String
  };
  code: string = '';
  html: string = '';
  connectedCallback() {
    super.connectedCallback();
    this.style.display = 'block';
  }
  render() {
    return (
      <Tabs
        css={`
          .tabs {
            border-bottom: none;
          }
          .tabs a {
            border-bottom: none;
          }
          .tabs a.selected,
          .tabs a:hover {
            background-color: #292d34;
            border-bottom: none;
            color: #eee;
          }
        `}
        items={[
          {
            name: 'Code',
            pane: <Code code={this.code} lang="js" />
          },
          {
            name: 'HTML',
            pane: this.html ? <Code code={this.html} lang="html" /> : ''
          },
          {
            name: 'Result',
            pane: this.html ? <Example html={this.html} /> : ''
          }
        ]}
      />
    );
  }
}
