import { define } from 'skatejs';
import '../../components/layout';
import '../../components/marked';
import { Component } from '../../utils';

export default define(
  class extends Component {
    static is = 'x-pages-utils-name';
    render() {
      return this.$`
      <x-layout title="name()">
        <x-marked src="${`
          The \`name()\` function generates a unique custom element name that you can use when you define your component.

          \`\`\`js
          import { name } from 'skatejs';

          // x-element
          name();

          // x-element-1
          name();
          \`\`\`

          You can also specify a "hint" that \`name()\` will use instead of \`element\`.

          \`\`\`js
          // x-tabs
          name('tabs');

          // my-tabs
          name('my-tabs');

          // my-tabs-1
          name('my-tabs');
          \`\`\`

          Name doesn't manage an internal cache of names, it uses \`customElements.get()\` to check to see if a name already exists. If it does, it increments the counter and repeats that until it finds a unique name. This means it will work with any number of custom elemetns from other sources that may have conflicting names.
        `}"></x-marked>
      </x-layout>
    `;
    }
  }
);
