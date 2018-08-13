import { readFileSync } from 'fs';
import css, { value } from 'yocss';
import { define } from 'skatejs';
import { Component } from '../utils';
import './tabs';

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

function highlight(elem, code, language) {
  // import('prismjs').then(Prism => {
  //   const prism = new Prism();
  //   prism.onmessage = e => {
  //     elem.innerHTML = e.data;
  //   };
  //   prism.postMessage(
  //     JSON.stringify({
  //       code,
  //       language
  //     })
  //   );
  // });
}

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

export const Code = define(
  class extends Component {
    static is = 'x-code';
    code: string = '';
    lang: string = '';
    title: string = '';
    connecting() {
      this.style.display = 'block';
    }
    render() {
      const { code, lang, title } = this;
      const src = document.createElement('div');
      src.textContent = format(code);
      highlight(src, code, mapLang[lang] || 'js');
      return this.$`
      <div>
        <style>${readFileSync(
          __dirname + '/../node_modules/prismjs/themes/prism-twilight.css'
        )}</style>
        <style textContent="${value(...values(cssCode))}"></style>
        ${
          title
            ? this.$`<div className="${cssCode.title}">${title}</div>`
            : null
        }
        <div className="${cssCode.code}">
          <pre className="${cssCode.pre}">${src}</pre>
        </div>
      </div>
    `;
    }
  }
);

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

export const Example = define(
  class extends Component {
    static is = 'x-example';
    props: {
      html: string;
      title: string;
    };
    connecting() {
      this.style.display = 'block';
    }
    renderer = function(root) {
      root.innerHTML = `
      <style>${value(...values(cssExample))}</style>
      ${
        this.title ? `<div class="${cssExample.title}">${this.title}</div>` : ''
      }
      <div class="${cssExample.code}">${this.html}</div>
    `;
    };
  }
);

export const Runnable = define(
  class extends Component {
    static is = 'x-runnable';
    code: string = '';
    html: string = '';
    connectedCallback() {
      super.connectedCallback();
      this.style.display = 'block';
    }
    render() {
      const { code, html } = this;
      return this.$`
      <x-tabs
        css="${`
          .tabs {
            border-bottom: none;
          }
          .tabs a {
            border-bottom: none;
          }
          .tabs a.selected,
          .tabs a:hover {
            background-color: #292D34;
            border-bottom: none;
            color: #eee;
          }
        `}"
        items="${[
          {
            name: 'Code',
            pane: this.$`<x-code code="${code}" lang="js"></x-code>`
          },
          {
            name: 'HTML',
            pane: html
              ? this.$`<x-code code="${html}" lang="html"></x-code>`
              : ''
          },
          {
            name: 'Result',
            pane: html ? this.$`<x-example html="${html}"></x-example>` : ''
          }
        ]}"
      ></x-tabs>
    `;
    }
  }
);
