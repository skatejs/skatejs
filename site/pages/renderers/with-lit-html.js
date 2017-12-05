// @flow

import '../../components/code';
import '../../components/layout';
import '../../components/primitives';

import { define } from 'skatejs';

import { Component } from '../../utils';

import './__samples__/with-lit-html';
import codeWithLitHtml from '!raw-loader!./__samples__/with-lit-html';
import codeWithLitHtmlHtml from '!raw-loader!./__samples__/with-lit-html.html';

@define
export default class extends Component {
  static is = 'x-pages-renderers-lit-html';
  render() {
    return this.$`
      ${this.$style}
      <x-layout title="LitHTML renderer">
        <p>
          The
          <a href="https://github.com/skatejs/renderer-lit-html">
            LitHTML renderer
          </a>
          allows you to render using
          <a href="https://github.com/PolymerLabs/lit-html">LitHTML</a>.
        </p>
        <x-runnable
          code="${codeWithLitHtml}"
          html="${codeWithLitHtmlHtml}"></x-runnable>
      </x-layout>
    `;
  }
}
