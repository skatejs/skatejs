// @flow

import '../../components/code';
import '../../components/layout';
import '../../components/primitives';

import { component, style } from '../../utils';

import './__samples__/with-renderer';
import codeWithRenderer from '!raw-loader!./__samples__/with-renderer';
import codeWithRendererHtml from '!raw-loader!./__samples__/with-renderer.html';

export default component(function mixinsWithRenderer() {
  return this.$`
    <x-layout title="Renderer">
      ${style(this.context.style)}
      <p>
        The <code>withRenderer</code> mixin is what connects view libraries such
        as <x-link href="/renderers/with-react">React</x-link>,
        <x-link href="/renderers/with-preact">Preact</x-link> and
        <x-link href="/renderers/with-lit-html">LitHTML</x-link> to the rest
        of Skate. It implements a <code>updated</code> method so it can be
        paired with the <code>withUpdate</code> mixin to automate renders, or
        you can call it imperatively yourself if not.
      </p>
      <x-runnable code="${
        codeWithRenderer
      }" html="${codeWithRendererHtml}"></x-runnable>
      <p>
        For more information on how to write renderers, see the
        <x-link href="/renderers">Renderers</x-link> section.
      </p>
    </x-layout>
  `;
});
