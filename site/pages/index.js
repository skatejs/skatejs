import '../components/code';
import '../components/layout';
import '../components/marked';
import '../components/primitives';

import { define } from 'skatejs';
import css from 'yocss';

import { Component, style } from '../utils';

import codeWithReact from '!raw-loader!./__samples__';
import README from '!raw-loader!../../README.md';

const renderers = {
  heading(text, level) {
    return level === 1 ? '' : `<h${level}>${text}</h${level}>`;
  }
};

@define
export default class extends Component {
  static is = 'x-pages-index';
  css = {
    code: css({
      borderRadius: '3px',
      boxShadow: '0 5px 50px 0 rgba(0, 0, 0, .5)',
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
      <x-code code="${codeWithReact}" className="${this.css.code}"></x-code>
      <x-hr></x-hr>
      <x-layout>
        <x-marked renderers="${renderers}" src="${README}"></x-marked>
      </x-layout>
    `;
  }
}
