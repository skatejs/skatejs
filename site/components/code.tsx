import { readFileSync } from 'fs';
import { Component, h } from '../utils';
import { Tabs } from './tabs';

// @ts-ignore;
const values = obj => Object.values(obj);

function format(src) {
  src = src || '';

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

// @ts-ignore
export class Code extends Component {
  static props = {
    children: null,
    code: String,
    lang: String,
    title: String
  };

  children?: any;
  code: string = '';
  lang?: string = 'js';
  title?: string = '';

  css = `
    .code {
      background-color: #292D34;
      color: #eee;
      margin: 0;
      overflow: auto;
      padding: 2px 20px;
    }),
    .pre {
      margin: 0;
    }
    .title {
      background-color: #20232A;
      color: #eee;
      font-size: .8em;
      padding: 10px 20px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.style.display = 'block';
  }

  refHighlight = e => {
    if (!e) return;
    import('prismjs').then(prism => {
      e.innerHTML = prism.highlight(
        format(this.innerHTML || this.code),
        prism.languages[this.lang] || prism.languages.markup,
        this.lang || 'markup'
      );
    });
  };

  render() {
    return (
      <div>
        <style>
          ${readFileSync(
            __dirname + '/../node_modules/prismjs/themes/prism-twilight.css'
          ).toString()}
        </style>
        {this.renderStyle()}
        {this.title ? <div class="title">{this.title}</div> : null}
        <div class="code">
          <pre class="pre" ref={this.refHighlight} />
        </div>
      </div>
    );
  }
}

// @ts-ignore
export class Example extends Component {
  static props = {
    html: String,
    title: String
  };

  html?: string = '';
  title?: string = '';

  css = `
    .code {
      background-color: #292D34;
      color: white;
      margin: 0;
      overflow: auto;
      padding: 20px;
    }
    .title {
      background-color: #20232A;
      color: #eee;
      font-size: .8em;
      padding: 10px 20px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.style.display = 'block';
  }

  render() {
    return (
      <div>
        {this.renderStyle()}
        {this.title ? <div class="title">{this.title}</div> : ''}
        <div
          class="code"
          ref={e => {
            e && (e.innerHTML = this.html);
          }}
        />
      </div>
    );
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
