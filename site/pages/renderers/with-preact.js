// @flow

import '../../components/code';
import '../../components/layout';
import '../../components/primitives';

import { component, style } from '../../utils';

import './__samples__/with-preact';
import codeWithPreact from '!raw-loader!./__samples__/with-preact';
import codeWithPreactHtml from '!raw-loader!./__samples__/with-preact.html';

export default component(function mixins() {
  return this.$`
    <x-layout title="Preact renderer">
      ${style(this.context.style)}
      <p>
        The
        <a href="https://github.com/skatejs/renderer-preact">Preact renderer</a>
        allows you to render using
        <a href="https://github.com/developit/preact">Preact</a>.
      </p>
      <x-runnable code="${
        codeWithPreact
      }" html="${codeWithPreactHtml}"></x-runnable>
    </x-layout>
  `;
});
