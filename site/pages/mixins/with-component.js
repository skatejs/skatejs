// @flow

import '../../components/code';
import '../../components/layout';

import { component, style } from '../../utils';

import './__samples__/with-component';
import codeWithComponent from '!raw-loader!./__samples__/with-component';
import codeWithComponentHtml from '!raw-loader!./__samples__/with-component.html';

export default component(function mixinsWithComponent() {
  return this.$`
    <x-layout title="Component">
      ${style(this.context.style)}
      <p>
        The <code>withComponent</code> mixin combines all of Skate's mixins into
        a single one for easy use. It's likely that this will be the most common
        mixin you'll pair with renderers when authoring components, unless you
        prefer to be selective about exactly which mixins you piece together.
      </p>
      <x-runnable code="${
        codeWithComponent
      }" html="${codeWithComponentHtml}"></x-runnable>
    </x-layout>
  `;
});
