// @flow

import '../../components/code';
import '../../components/layout';
import '../../components/primitives';

import { define } from 'skatejs';

import { Component } from '../../utils';

import './__samples__/with-preact';
import codeWithPreact from '!raw-loader!./__samples__/with-preact';
import codeWithPreactHtml from '!raw-loader!./__samples__/with-preact.html';

@define
export default class extends Component {
  static is = 'x-pages-renderers-preact';
  render() {
    return this.$`
      ${this.$style}
      <x-layout title="Preact renderer">
        <p>
          The
          <a href="https://github.com/skatejs/renderer-preact">Preact renderer</a>
          allows you to render using
          <a href="https://github.com/developit/preact">Preact</a>.
        </p>
        <x-runnable
          code="${codeWithPreact}"
          html="${codeWithPreactHtml}"></x-runnable>
      </x-layout>
    `;
  }
}
