// @flow

import '../../components/code';
import '../../components/layout';
import '../../components/primitives';

import { component, style } from '../../utils';

export default component(function mixins() {
  return this.$`
    <x-layout title="Renderers">
      ${style(this.context.style)}
      <p>
        Renderers are a way to take any UI library and essentially wrap a web
        component around it. We've provided renderers for some of the popular UI
        libraries:
      </p>
      <ul>
        <li>
          <x-link href="/renderers/with-lit-html">LitHTML</x-link>
        </li>
        <li>
          <x-link href="/renderers/with-preact">Preact</x-link>
        </li>
        <li>
          <x-link href="/renderers/with-react">React</x-link>
        </li>
      </ul>
      <p>
        Skate also ships with a super-simple
        <x-link href="/renderers/default">default renderer</x-link> that
        simply sets <code>innerHTML</code>. It's a fantastic way to mock up and
        write simple components without requiring a UI library.
      </p>
      <h3>Writing a renderer</h3>
      <p>
        The best way to write a renderer is to base it on the
        <code>
          <x-link href="/mixins/with-renderer">withRenderer</x-link>
        </code>
        mixin API. To do this, you implement the <code>renderer</code> method on
        your class.
      </p>
      <x-code
        code="${`
          interface Renderer {
            renderer(root: Node, render: Function): void;
          }
        `}"
      ></x-code>
      <h4>A simple implementation</h4>
      <p>
        An example of a simple, concrete implementation of this might be to
        write a renderer that simply sets <code>innerHTML</code>. This is the
        default behaviour provided by the default <code>renderer()</code> function and is
        great for mockups, simple or static components. It's probably too naive
        for complex components that re-render a lot. However, it also serves as
        a fine example to show how to use the renderer API.
      </p>
      <x-code
        code="${`
          // ./my-renderer.js

          export default class extends HTMLElement {
            renderer(root, render) {
              root.innerHTML = render();
            }
          }
        `}
      ></x-code>
      <p>
        All this renderer does is simply set the <code>innerHTML</code> of the
        node that we're supposed to render to. We've called this node the
        <code>root</code>.
      </p>
      <p>
        The <code>render</code> argument is a bound function of the
        <code>render</code> method you define on your class. To use this
        renderer, you'd do something like:
      </p>
      <x-code
        code="${`
          // ./my-component.js

          import MyRenderer from './my-renderer';

          export default class extends MyRenderer {
            render() {
              return 'Hello, World!';
            }
          }
        `}
      ></x-code>
      <x-note>
        The <code>render</code> function is bound with the host element as
        <code>this</code> and the first argument, so you can also destructure in
        the function arguments, if you want to.
      </x-note>
      <h4>Hooking it up</h4>
      <p>
        The one problem here is that your component doesn't yet know how to hook
        up <code>render</code> with <code>renderer</code> because you need to
        mixin <code>withRenderer</code>.
      </p>
      <x-code
        code="${`
          // ./my-component.js

          import { withRenderer } from 'skatejs';
          import MyRenderer from './my-renderer';

          export default class extends withRenderer(MyRenderer) {
            render() {
              return 'Hello, World!';
            }
          }
        `}
      ></x-code>
      <h4>Reuse</h4>
      <p>
        If you want to make this renderer a bit more generic, you might want it
        to be able to accept other types of base classes, as opposed to having
        it fixed to <code>HTMLElement</code>. To do this, just make it a mixin.
        This consists of making it into a function that returns a class.
      </p>
      <x-code
        code="${`
          // ./my-renderer.js

          export default (Base = HTMLElement) =>
            class extends Base {
              renderer(root, render) {
                root.innerHTML = render();
              }
            }
        `}
      ></x-code>
      <p>
        And there you have your renderer that you can reuse with any component.
      </p>
      <p>
        Taking the <code>render</code> example a bit further, it will now look
        something like:
      </p>
      <x-code
        code="${`
          // ./my-component.js

          import { withRenderer } from 'skatejs';
          import myRenderer from './my-renderer';

          export default class extends withRenderer(myRenderer()) {
            render() {
              return 'Hello, World!';
            }
          }
        `}
      ></x-code>
      <h4>Responding to attributes and properties</h4>
      <p>
        This component doesn't yet respond to property sets, or have any dynamic
        states. If we wanted to, say, accept a name property or attribute, we
        can mixin the <code>withUpdate</code> and <code>withRenderer</code>
        mixins with your renderer.
      </p>
      <x-code
        code="${`
          // ./my-component.js

          import { props, withRenderer, withUpdate } from 'skatejs';
          import myRenderer from './my-renderer';

          export default class extends withRenderer(withUpdate(myRenderer())) {
            static props = {
              name: props.string
            };
            render({ name }) {
              return \`Hello, \${name}!\`;
            }
          }
        `}
      ></x-code>
      <p>
        This component would now render when both a <code>name</code> property
        <em>and</em> a <code>name</code> attribute are set.
      </p>
      <h4>Simplifying as a base class</h4>
      <p>
        If you don't want to repeat the mixin calls, simply make it a base
        class:
      </p>
      <x-code
        code="${`
          // ./my-base.js

          import { withRenderer, withUpdate } from 'skatejs';
          import myRenderer from './my-renderer';

          export default myRenderer(withRenderer(withUpdate()));
        `}
      ></x-code>
      <x-note>
        Your renderer can be composed into any point of your mixin chain, too!
      </x-note>
      <p>Your component then can use it:</p>
      <x-code
        code="${`
          // ./my-component.js

          import { props } from 'skatejs';
          import MyBase from './my-base';

          class MyComponent extends MyBase {
            static props = {
              name: props.string
            };
            render({ name }) {
              return \`Hello, \${name}!\`;
            }
          }
        `}
      ></x-code>
    </x-layout>
  `;
});
