// @flow

import { component, h } from '../../utils';
import { Code } from '../../components/code';
import { Layout } from '../../components/layout';
import { Link, Note } from '../../components/primitives';

export default component(function mixins() {
  return (
    <Layout.is title="Renderers">
      <style>{this.context.style}</style>
      <p>
        Renderers are a way to take any UI library and essentially wrap a web
        component around it. We've provided renderers for some of the popular UI
        libraries:
      </p>
      <ul>
        <li>
          <Link.is href="/renderers/with-lit-html">LitHTML</Link.is>
        </li>
        <li>
          <Link.is href="/renderers/with-preact">Preact</Link.is>
        </li>
        <li>
          <Link.is href="/renderers/with-react">React</Link.is>
        </li>
      </ul>
      <h3>Writing a renderer</h3>
      <p>
        The best way to write a renderer is to base it on the{' '}
        <code>
          <Link.is href="/mixins/with-renderer">withRenderer</Link.is>
        </code>{' '}
        mixin API. To do this, you implement the <code>renderer</code> method on
        your class.
      </p>
      <Code.is
        code={`
          interface Renderer {
            renderer(root: Node, render: Function): void;
          }
        `}
      />
      <h4>A simple implementation</h4>
      <p>
        An example of a simple, concrete implementation of this might be to
        write a renderer that simply sets <code>innerHTML</code>. In practice
        this can prove to be too naive an implementation for complex components,
        but is a great way to show how to write a simple renderer.
      </p>
      <Code.is
        code={`
          // ./my-renderer.js

          export default class extends HTMLElement {
            renderer(root, render) {
              root.innerHTML = render();
            }
          }
        `}
      />
      <p>
        All this renderer does is simply set the <code>innerHTML</code> of the
        node that we're supposed to render to. We've called this node the{' '}
        <code>root</code>.
      </p>
      <p>
        The <code>render</code> argument is a bound function of the{' '}
        <code>render</code> method you define on your class. To use this
        renderer, you'd do something like:
      </p>
      <Code.is
        code={`
          // ./my-component.js

          import MyRenderer from './my-renderer';

          export default class extends MyRenderer {
            render() {
              return 'Hello, World!';
            }
          }
        `}
      />
      <Note.is>
        The <code>render</code> function is bound with the host element as{' '}
        <code>this</code> and the first argument, so you can also destructure in
        the function arguments, if you want to.
      </Note.is>
      <h4>Hooking it up</h4>
      <p>
        The one problem here is that your component doesn't yet know how to hook
        up <code>render</code> with <code>renderer</code> because you need to
        mixin <code>withRenderer</code>.
      </p>
      <Code.is
        code={`
          // ./my-component.js

          import { withRenderer } from 'skatejs';
          import MyRenderer from './my-renderer';

          export default class extends withRenderer(MyRenderer) {
            render() {
              return 'Hello, World!';
            }
          }
        `}
      />
      <h4>Reuse</h4>
      <p>
        If you want to make this renderer a bit more generic, you might want it
        to be able to accept other types of base classes, as opposed to having
        it fixed to <code>HTMLElement</code>. To do this, just make it a mixin.
        This consists of making it into a function that returns a class.
      </p>
      <Code.is
        code={`
          // ./my-renderer.js

          export default (Base = HTMLElement) =>
            class extends Base {
              renderer(root, render) {
                root.innerHTML = render();
              }
            }
        `}
      />
      <p>
        And there you have your renderer that you can reuse with any component.
      </p>
      <p>
        Taking the <code>render</code> example a bit further, it will now look
        something like:
      </p>
      <Code.is
        code={`
          // ./my-component.js

          import { withRenderer } from 'skatejs';
          import myRenderer from './my-renderer';

          export default class extends withRenderer(myRenderer()) {
            render() {
              return 'Hello, World!';
            }
          }
        `}
      />
      <h4>Responding to attributes and properties</h4>
      <p>
        This component doesn't yet respond to property sets, or have any dynamic
        states. If we wanted to, say, accept a name property or attribute, we
        can mixin the <code>withUpdate</code> and <code>withRenderer</code>{' '}
        mixins with your renderer.
      </p>
      <Code.is
        code={`
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
      />
      <p>
        This component would now render when both a <code>name</code> property{' '}
        <em>and</em> a <code>name</code> attribute are set.
      </p>
      <h4>Simplifying as a base class</h4>
      <p>
        If you don't want to repeat the mixin calls, simply make it a base
        class:
      </p>
      <Code.is
        code={`
          // ./my-base.js

          import { withRenderer, withUpdate } from 'skatejs';
          import myRenderer from './my-renderer';

          export default myRenderer(withRenderer(withUpdate()));
        `}
      />
      <Note.is>
        Your renderer can be composed into any point of your mixin chain, too!
      </Note.is>
      <p>Your component then can use it:</p>
      <Code.is
        code={`
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
      />
    </Layout.is>
  );
});
