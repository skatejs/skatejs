// @flow

import '../../components/layout';
import '../../components/marked';

import { define } from 'skatejs';

import { Component } from '../../utils';

@define
export default class extends Component {
  static is = 'x-pages-mixins';
  render() {
    return this.$`
      <x-layout title="Mixins">
        <x-marked src="${`
          [Mixins](http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/) are a way to take several class
          definitions and compose them into one. It works well for custom elements
          because every element has a different purpose and it allows you to pick
          and choose what goes into it. It's also what lets you render one
          component with <x-link href="/renderers/with-preact">Preact</x-link>
          and maybe another with [LitHTML](/renderers/with-lit-html). Each
          component is self-contained.

          Skate's mixins follow a common component lifecycle specification, which
          enables it to interop with not only itself, but also other libraries.
          The specification is described as follows and is what you get if you
          combine all of the mixins together, or use the [\`withComponent\`](/mixins/with-component)
          mixin.

          \`\`\`js
          interface Component {
            // withChildren
            childrenUpdated(): void;

            // withContext
            context: Object;

            // withLifecycle
            connecting(): void;
            connected(): void;
            disconnecting(): void;
            disconnected(): void;

            // withRenderer
            rendering(): void;
            render(props: Object, state: Object): any;
            rendered(): void;
            renderer(root: Node, render: Render): void;

            // withUpdate
            static props: PropTypes;
            props: Object;
            state: Object;
            updating(prevProps: Object, prevState: Object): void;
            shouldUpdate(prevProps: Object, prevState: Object): boolean;
            updated(prevProps: Object, prevState: Object): void;
            triggerUpdate(): void;
          }
          \`\`\`
        `}"></x-marked>
      </x-layout>
    `;
  }
}
