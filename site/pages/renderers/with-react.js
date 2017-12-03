// @flow

import '../../components/code';
import '../../components/layout';
import '../../components/primitives';

import { component, style } from '../../utils';

import './__samples__/with-react';
import codeWithReact from '!raw-loader!./__samples__/with-react';
import codeWithReactHtml from '!raw-loader!./__samples__/with-react.html';

export default component(function mixins() {
  return this.$`
    <x-layout title="React renderer">
      ${style(this.context.style)}
      <p>
        The
        <a href="https://github.com/skatejs/renderer-react">React renderer</a>
        allows you to render using <a href="https://reactjs.org/">React</a>.
      </p>
      <x-runnable code="${
        codeWithReact
      }" html="${codeWithReactHtml}"></x-runnable>
    </x-layout>
  `;
});
