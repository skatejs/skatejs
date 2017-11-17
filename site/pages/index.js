import { component, h } from '../utils';
import { Code } from '../components/code';
import { Layout } from '../components/layout';
import { Hr, Link } from '../components/primitives';

import codeWithReact from '!raw-loader!./__samples__';

export default component(function index() {
  return (
    <div>
      <style>{`
        ${this.context.style}
        .code {
          border-radius: 3px;
          box-shadow: 0 5px 50px 0 rgba(0, 0, 0, .5);
          margin: 0 auto;
          overflow: hidden;
          max-width: 600px;
        }
        .hero {
          margin: 60px 0;
          text-align: center;
        }
        .title {
          margin-bottom: 30px;
        }
        .subtitle {
          font-size: 1.4em;
          margin-tom: 30px;
        }
      `}</style>
      <div class="hero">
        <h1 class="title">SkateJS</h1>
        <h2 class="subtitle">
          Effortless custom elements for modern view libraries.
        </h2>
      </div>
      <Code.is code={codeWithReact} class="code" />
      <Hr.is />
      <Layout.is nav={false}>
        <h2>Mixins</h2>
        <p>
          The{' '}
          <a href="http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/">
            mixin
          </a>{' '}
          pattern is a way to compose functionality from several abstract
          classes into a single one. Skate is a{' '}
          <Link.is href="/mixins">collection of mixins</Link.is> designed to
          augment <code>HTMLElement</code> to serve 90% of use cases for 90% of
          components. It can be paired with other mixins, such as those found in{' '}
          <a href="https://www.polymer-project.org/">Polymer</a>.
        </p>
        <p>Our mixins include:</p>
        <ul>
          <li>
            <Link.is href="/mixins/with-children">
              <code>withChildren()</code>
            </Link.is>{' '}
            react to changes in child content.
          </li>
          <li>
            <Link.is href="/mixins/with-component">
              <code>withComponent()</code>
            </Link.is>{' '}
            all the mixins in one.
          </li>
          <li>
            <Link.is href="/mixins/with-context">
              <code>withContext()</code>
            </Link.is>{' '}
            inherit context from components up the tree, like in React.
          </li>
          <li>
            <Link.is href="/mixins/with-lifecycle">
              <code>withLifecycle()</code>
            </Link.is>{' '}
            adds sugar on top of the built-in lifecycle callbacks.
          </li>
          <li>
            <Link.is href="/mixins/with-renderer">
              <code>withRenderer()</code>
            </Link.is>{' '}
            easily write renderers for your favourite view library or templating
            language.
          </li>
          <li>
            <Link.is href="/mixins/with-unique">
              <code>withUnique()</code>
            </Link.is>{' '}
            derive the custom element name from its class name, and generate
            non-conflicting custom element names.
          </li>
          <li>
            <Link.is href="/mixins/with-update">
              <code>withUpdate()</code>
            </Link.is>{' '}
            react to property and attribute updates.
          </li>
        </ul>
        <p>
          See the <Link.is href="/mixins">mixin docs</Link.is> for more info.
        </p>
        <h2>Renderers</h2>
        <p>
          Because Skate provides a hook for renderers, it can support any view
          library such as React, Preact, Vue and more.
        </p>
        <p>
          We've provided a few renderers for popular front-end libraries:
          <ul>
            <li>
              <a href="/renderers/with-lit-html">LitHTML</a>
            </li>
            <li>
              <a href="/renderers/with-preact">Preact</a>
            </li>
            <li>
              <a href="/renderers/with-react">React</a>
            </li>
          </ul>
        </p>
        <p>
          See the <Link.is href="/renderers">renderer docs</Link.is> for more
          info.
        </p>
        <h2>Utilities</h2>
        <p>
          On top of the core concepts of mixins and renderers, Skate also
          provides some utils for common patterns within your components. Some
          of these include:
        </p>
        <ul>
          <li>
            <Link.is href="/utils/define">
              <code>define()</code>
            </Link.is>{' '}
            - Creating and defining custom elements all at once.
          </li>
          <li>
            <Link.is href="/utils/emit">
              <code>emit()</code>
            </Link.is>{' '}
            - Streamlined event emitting.
          </li>
          <li>
            <Link.is href="/utils/link">
              <code>link()</code>
            </Link.is>{' '}
            - linking UI elements back to component state.
          </li>
          <li>
            <Link.is href="/utils/link">
              <code>shadow()</code>
            </Link.is>{' '}
            - create a shadow root if it doesn't exist, but return it
            regardless. Works with <code>closed</code> mode, too.
          </li>
        </ul>
        <p>
          See the <Link.is href="/utils">utility docs</Link.is> fore more info.
        </p>
      </Layout.is>
    </div>
  );
});
