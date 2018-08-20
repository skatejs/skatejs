import { h } from '@skatejs/renderer-preact';
import { readFileSync } from 'fs';
import css from 'yocss';
import '../components/code';
import '../components/layout';
import '../components/marked';
import '../components/primitives';
import { Component } from '../utils';
import './renderers/__samples__/preact';

const codeWithPreact = readFileSync(
  __dirname + '/renderers/__samples__/preact.tsx'
);
const codeWithPreactHtml = readFileSync(
  __dirname + '/renderers/__samples__/preact.html'
);
const README = readFileSync(__dirname + '/../../README.md');

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
        {/* <x-runnable
          class={this.css.code}
          code={codeWithPreact}
          html={codeWithPreactHtml}
        />
        <x-hr />
        <x-layout>
          <x-marked renderers={renderers} src={README} />
        </x-layout> */}
      </div>
    );
  }
}
