// @flow

import '../../components/code';
import '../../components/layout';

import { component, style } from '../../utils';

import './__samples__/with-unique';
import codeWithUnique from '!raw-loader!./__samples__/with-unique';
import codeWithUniqueHtml from '!raw-loader!./__samples__/with-unique.html';

export default component(function mixinsWithUnique() {
  return this.$`
    <x-layout title="Unique">
      ${style(this.context.style)}
      <p>
        The <code>withUnique</code> mixin allows you to define custom elements
        without having to specify a name. It defines a <code>static is</code>
        property that will return a unique name for the element.
      </p>
      <x-runnable code="${
        codeWithUnique
      }" html="${codeWithUniqueHtml}"></x-runnable>
    </x-layout>
  `;
});
