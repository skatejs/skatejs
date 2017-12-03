// @flow

import '../../components/code';
import '../../components/layout';
import '../../components/primitives';

import { component, style } from '../../utils';

import './__samples__/default';
import codeWithDefault from '!raw-loader!./__samples__/default';
import codeWithDefaultHtml from '!raw-loader!./__samples__/default.html';

export default component(function mixins() {
  return this.$`
    <x-layout title="Default renderer">
      ${style(this.context.style)}
      <p>
        The default renderer is what's provided by the base
        <code>withRenderer()</code> mixin if you don't provide a custom
        <code>renderer()</code> method.
      </p>
      <p>
        This renderer will simply set the <code>innerHTML</code> of the
        <code>renderRoot</code>, which defaults to the <code>shadowRoot</code>
        of the custom element you're writing. If no shadow root is created, one
        will be created for you.
      </p>
      <x-runnable code="${
        codeWithDefault
      }" html="${codeWithDefaultHtml}"></x-runnable>
    </x-layout>
  `;
});
