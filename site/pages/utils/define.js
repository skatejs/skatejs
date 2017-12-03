// @flow

import '../../components/layout';
import '../../components/marked';

import { component } from '../../utils';

export default component(function utilsDefine() {
  return this.$`
    <x-layout title="define()">
      <x-marked src="${`
        The \`define()\` function takes a custom element constructor and defines it using the value of the \`static is\` class property.

        This is very useful both if you like defining your components using that property, or if you're using the \`withUnique()\` mixin. If you're using the mixin, it will automatically define a name if you haven't defined one yet which can be useful in a variety of situations.

        \`\`\`js
        import { define } from 'skatejs';

        define(
          class extends HTMLElement {
            static is = 'my-element';
          }
        );
        \`\`\`

        For more information on how \`withUnique()\` comes up with a unique name, see [its docs](/mixins/with-unique).
      `}"></x-marked>
    </x-layout>
  `;
});
