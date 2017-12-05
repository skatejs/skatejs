// @flow

import '../../components/code';
import '../../components/layout';
import '../../components/primitives';

import { define } from 'skatejs';

import { Component } from '../../utils';

import './__samples__/with-react';
import codeWithReact from '!raw-loader!./__samples__/with-react';
import codeWithReactHtml from '!raw-loader!./__samples__/with-react.html';

@define
export default class extends Component {
  static is = 'x-pages-renderers-react';
  render() {
    return this.$`
      ${this.$style}
      <x-layout title="React renderer">
        <p>
          The
          <a href="https://github.com/skatejs/renderer-react">React renderer</a>
          allows you to render using <a href="https://reactjs.org/">React</a>.
        </p>
        <x-runnable
          code="${codeWithReact}"
          html="${codeWithReactHtml}"></x-runnable>
      </x-layout>
    `;
  }
}
