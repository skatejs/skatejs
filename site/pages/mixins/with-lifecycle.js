// @flow

import '../../components/code';
import '../../components/layout';

import { component, style } from '../../utils';

import './__samples__/with-lifecycle';
import codeWithComponent from '!raw-loader!./__samples__/with-lifecycle';
import codeWithComponentHtml from '!raw-loader!./__samples__/with-lifecycle.html';

export default component(function mixinsWithLifecycle() {
  return this.$`
    <x-layout title="Lifecycle">
      ${style(this.context.style)}
      <p>
        The <code>withLifecycle</code> mixin adds sugar around the native
        lifecycle callbacks. It wraps before and after callbacks around them,
        which allows you to add lifecycles without having to remember to call
        super.
      </p>
      <x-runnable code="${
        codeWithComponent
      }" html="${codeWithComponentHtml}"></x-runnable>
      <p>
        The example above shows the methods that get called when mounted. When
        unmounted from the DOM, their counterparts are also called:
      </p>
      <ul>
        <li>
          <code>disconnecting()</code>
        </li>
        <li>
          <code>disconnected()</code>
        </li>
      </ul>
    </x-layout>
  `;
});
