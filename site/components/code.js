import './tabs';

import { html } from 'lit-html/lib/lit-extended';
import css, { value } from 'yocss';
import { define, props } from 'skatejs';

import { Component, h, withLoadable } from '../utils';

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

withLoadable({
  is: 'code-style',
  format: r => html`<style textContent="${r}"></style>`,
  loader: () => import('raw-loader!prismjs/themes/prism-twilight.css')
});

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
    connecting() {
      super.connecting();
      this.style.display = 'block';
    }
    render({ code, lang, title }) {
      const src = document.createElement('div');
      src.textContent = format(code);
      highlight(src, code, lang);
      return this.$`
        <div>
          <code-style></code-style>
          <style textContent="${value(...Object.values(cssCode))}"></style>
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
  class Example extends Component {
    props: {
      html: string,
      title: string
    };
    connecting() {
      super.connecting();
      this.style.display = 'block';
    }
    renderer(root) {
      root.innerHTML = `
        <style>${value(...Object.values(cssExample))}</style>
        ${
          this.title
            ? `<div class="${cssExample.title}">${this.title}</div>`
            : ''
        }
        <div class="${cssExample.code}">${this.html}</div>
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
    connecting() {
      super.connecting();
      this.style.display = 'block';
    }
    render({ code, html }) {
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
