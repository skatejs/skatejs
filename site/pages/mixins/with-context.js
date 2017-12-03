// @flow

import '../../components/code';
import '../../components/layout';

import { component, style } from '../../utils';

import './__samples__/with-context';
import codeWithComponent from '!raw-loader!./__samples__/with-context';
import codeWithComponentHtml from '!raw-loader!./__samples__/with-context.html';

export default component(function mixinsWithContext() {
  return this.$`
    <x-layout title="Context">
      ${style(this.context.style)}
      <p>
        The <code>withContext</code> mixin allows you to use
        <code>context</code> like in <a href="https://reactjs.org/">React</a>.
      </p>
      <x-runnable code="${
        codeWithComponent
      }" html="${codeWithComponentHtml}"></x-runnable>
    </x-layout>
  `;
});
