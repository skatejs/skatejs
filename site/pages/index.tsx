import { readFileSync } from 'fs';
import css from 'yocss';
import { Runnable } from '../components/code';
import { Layout } from '../components/layout';
import { Marked } from '../components/marked';
import { Hr } from '../components/primitives';
import { Component, h } from '../utils';
import './renderers/__samples__/preact';

const codeWithPreact = readFileSync(
  __dirname + '/renderers/__samples__/preact.tsx'
);
const codeWithPreactHtml = readFileSync(
  __dirname + '/renderers/__samples__/preact.html'
);
const README = readFileSync(__dirname + '/../../README.md').toString('utf-8');

const renderers = {
  heading(text, level) {
    return level === 1 ? '' : `<h${level}>${text}</h${level}>`;
  }
};

export default class Index extends Component {
  css = {
    code: css({
      margin: '0 auto',
      overflow: 'hidden',
      maxWidth: '600px'
    }),
    hero: css({
      margin: '60px 0',
      textAlign: 'center'
    }),
    subtitle: css({
      fontSize: '1.4em',
      marginTop: '30px'
    }),
    title: css({
      marginBottom: '30px'
    })
  };
  render() {
    return (
      <div>
        {this.$style}
        <div class={this.css.hero}>
          <h1 class={this.css.title}>SkateJS</h1>
          <h2 class={this.css.subtitle}>
            Effortless custom elements for modern view libraries.
          </h2>
        </div>
        <Runnable
          class={this.css.code}
          code={codeWithPreact}
          html={codeWithPreactHtml}
        />
        <Hr />
        <Layout>
          <Marked renderers={renderers} src={README} />
        </Layout>
      </div>
    );
  }
}
