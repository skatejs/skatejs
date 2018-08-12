import { define } from 'skatejs';
import css from 'yocss';
import '../components/code';
import '../components/layout';
import '../components/marked';
import '../components/primitives';
import { Component, style } from '../utils';
import './renderers/__samples__/with-preact';

const codeWithPreact = fs.readFileSync('./renderers/__samples__/with-preact');
const codeWithPreactHtml = fs.readFileSync(
  './renderers/__samples__/with-preact.html'
);
const README = fs.readFileSync('../../README.md');

const renderers = {
  heading(text, level) {
    return level === 1 ? '' : `<h${level}>${text}</h${level}>`;
  }
};

export default define(
  class extends Component {
    static is = 'x-pages-index';
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
      return this.$`
      ${this.$style}
      <div className="${this.css.hero}">
        <h1 className="${this.css.title}">SkateJS</h1>
        <h2 className="${this.css.subtitle}">
          Effortless custom elements for modern view libraries.
        </h2>
      </div>
      <x-runnable
        className="${this.css.code}"
        code="${codeWithPreact}"
        html="${codeWithPreactHtml}"></x-runnable>
      <x-hr></x-hr>
      <x-layout>
        <x-marked renderers="${renderers}" src="${README}"></x-marked>
      </x-layout>
    `;
    }
  }
);
