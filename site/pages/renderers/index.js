// @flow

import '../../components/code';
import '../../components/layout';
import '../../components/primitives';

import { define } from 'skatejs';

import { Component } from '../../utils';

export default define(
  class extends Component {
    static is = 'x-pages-renderers-index';
    render() {
      return this.$`
        <x-layout title="Renderers">
          <x-marked src="${`
            Renderers are a way to take any UI library and essentially wrap a web
            component around it. We've provided renderers for some of the popular UI
            libraries:

            - [LitHTML](/renderers/with-lit-html)
            - [Preact](/renderers/with-preact)
            - [React](/renderers/with-react)

            Skate also ships with a super-simple
            [default renderer](/renderers/default) that
            simply sets \`innerHTML\`. It's a fantastic way to mock up and
            write simple components without requiring a UI library.

            ### Writing a renderer

            The best way to write a renderer is to base it on the
            [\`withRenderer\`](/mixins/with-renderer)
            mixin API. To do this, you implement the \`renderer\` method on
            your class.

            \`\`\`js
            interface Renderer {
              renderer(root: Node, render: Function): void;
            }
            \`\`\`

            #### A simple implementation

            An example of a simple, concrete implementation of this might be to
            write a renderer that simply sets \`innerHTML\`. This is the
            default behaviour provided by the default \`renderer()\` function and is
            great for mockups, simple or static components. It's probably too naive
            for complex components that re-render a lot. However, it also serves as
            a fine example to show how to use the renderer API.

            \`\`\`js
            // ./my-renderer.js

            export default class extends HTMLElement {
              renderer(root, render) {
                root.innerHTML = render();
              }
            }
            \`\`\`

            All this renderer does is simply set the \`innerHTML\` of the
            node that we're supposed to render to. We've called this node the
            \`root\`.

            The \`render\` argument is a bound function of the
            \`render\` method you define on your class. To use this
            renderer, you'd do something like:

            \`\`\`js
            // ./my-component.js

            import MyRenderer from './my-renderer';

            export default class extends MyRenderer {
              render() {
                return 'Hello, World!';
              }
            }
            \`\`\`

            > The \`render\` function is bound with the host element as
            \`this\` and the first argument, so you can also destructure in
            the function arguments, if you want to.

            #### Hooking it up

            The one problem here is that your component doesn't yet know how to hook
            up \`render\` with \`renderer\` because you need to
            mixin \`withRenderer\`.

            \`\`\`js
            // ./my-component.js

            import { withRenderer } from 'skatejs';
            import MyRenderer from './my-renderer';

            export default class extends withRenderer(MyRenderer) {
              render() {
                return 'Hello, World!';
              }
            }
            \`\`\`

            #### Reuse

            If you want to make this renderer a bit more generic, you might want it
            to be able to accept other types of base classes, as opposed to having
            it fixed to \`HTMLElement\`. To do this, just make it a mixin.
            This consists of making it into a function that returns a class.

            \`\`\`js
            // ./my-renderer.js

            export default (Base = HTMLElement) =>
              class extends Base {
                renderer(root, render) {
                  root.innerHTML = render();
                }
              }
            \`\`\`

            And there you have your renderer that you can reuse with any component.

            Taking the \`render\` example a bit further, it will now look
            something like:

            \`\`\`js
            // ./my-component.js

            import { withRenderer } from 'skatejs';
            import myRenderer from './my-renderer';

            export default class extends withRenderer(myRenderer()) {
              render() {
                return 'Hello, World!';
              }
            }
            \`\`\`

            #### Responding to attributes and properties

            This component doesn't yet respond to property sets, or have any dynamic
            states. If we wanted to, say, accept a name property or attribute, we
            can mixin the \`withUpdate\` and \`withRenderer\`
            mixins with your renderer.

            \`\`\`js
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
            \`\`\`

            This component would now render when both a \`name\` property
            _and_ a \`name\` attribute are set.

            #### Simplifying as a base class

            If you don't want to repeat the mixin calls, simply make it a base
            class:

            \`\`\`js
            // ./my-base.js

            import { withRenderer, withUpdate } from 'skatejs';
            import myRenderer from './my-renderer';

            export default myRenderer(withRenderer(withUpdate()));
            \`\`\`

            > Your renderer can be composed into any point of your mixin chain, too!

            Your component then can use it:

            \`\`\`js
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
            \`\`\`
          `}"></x-marked>
        </x-layout>
      `;
    }
  }
);
