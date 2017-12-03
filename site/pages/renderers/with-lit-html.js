// @flow

import '../../components/code';
import '../../components/layout';
import '../../components/primitives';

import { component, style } from '../../utils';

import './__samples__/with-lit-html';
import codeWithLitHtml from '!raw-loader!./__samples__/with-lit-html';
import codeWithLitHtmlHtml from '!raw-loader!./__samples__/with-lit-html.html';

export default component(function mixins() {
  return this.$`
    <x-layout title="LitHTML renderer">
      ${style(this.context.style)}
      <p>
        The
        <a href="https://github.com/skatejs/renderer-lit-html">
          LitHTML renderer
        </a>
        allows you to render using
        <a href="https://github.com/PolymerLabs/lit-html">LitHTML</a>.
      </p>
      <x-runnable code="${
        codeWithLitHtml
      }" html="${codeWithLitHtmlHtml}"></x-runnable>
    </x-layout>
  `;
});
