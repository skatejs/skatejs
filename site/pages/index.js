import { component, h } from '../utils';

import { Code, Example, Runnable } from '../components/code';
import { Hr } from '../components/primitives';
import { Tabs } from '../components/tabs';

import codeWithChildren from '!raw-loader!../../test/samples/with-children';
import codeWithReact from '!raw-loader!../../test/samples/with-react';

const examples = [
  {
    name: 'withChildren',
    pane: [
      <p>
        The <code>withChildren</code> mixin allows you to react to changes to
        your component's <code>children</code> by implementing a{' '}
        <code>childrenChangedCallback</code>.
      </p>,
      <Runnable.is code={codeWithChildren} />
    ]
  },
  {
    name: 'withComponent',
    pane: [
      <p>
        The <code>withComponent</code> mixin combines all of Skate's mixins into
        a single one for easy use. It's likely that this will be the most common
        mixin you'll pair with renderers when authoring components, unless you
        prefer to be selective about exactly which mixins you piece together.
      </p>,
      <Runnable.is />
    ]
  },
  {
    name: 'withProps',
    pane: [
      <p>
        The <code>withProps</code> mixin is the heart of Skate and is what makes
        attribute / property linkage and reflection manageable by enforcing a
        convention that follows best-practices. It also exports several
        pre-defined property types that handle serialisation and deserialisation
        to / from attributes when they're set, as well as coercion when the
        property is set. When properties update, everything funnels into a
        single set of functions that are called so that you can update your
        component in a functional manner.
      </p>,
      <Runnable.is />
    ]
  },
  {
    name: 'withRenderer',
    pane: [
      <p>
        The <code>withRenderer</code> mixin is what connects view libraries such
        as React, Preact and Lit HTML to the rest of Skate. It implements a{' '}
        <code>propsUpdatedCallback</code> so it can be paired up with the{' '}
        <code>withProps</code> mixin, or you can call it imperatively yourself
        if not.
      </p>,
      <p>
        To see the stark difference when paired with the <code>withProps</code>{' '}
        mixin, look at the <code>withComponent</code> or <code>withProps</code>{' '}
        minxins.
      </p>,
      <Runnable.is />
    ]
  },
  {
    name: 'withState',
    pane: [
      <p>
        The <code>withState</code> mixin enables the idea of internal state,
        much like the idea of state in React and other similar libraries. When
        state is updated, it calls a method on the instance called{' '}
        <code>triggerUpdate</code> if it's defined.
      </p>,
      <Runnable.is />
    ]
  },
  {
    name: 'withUnique',
    pane: [
      <p>
        The <code>withUnique</code> mixin allows you to define custom elements
        without having to specify a name. It defines a static <code>is</code>{' '}
        property that will return a unique name for the element.
      </p>,
      <Runnable.is />
    ]
  }
];

export default component(host => (
  <div>
    <style>{`
      .code {
        margin: 0 auto;
        width: 600px;
      }
    `}</style>
    <Runnable.is code={codeWithReact} class="code" />
    <Hr.is />
    <h2>Mixins</h2>
    <p>
      The{' '}
      <a href="http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/">
        mixin
      </a>{' '}
      pattern is a way to compose functionality from several abstract classes
      into a single one. Skate is a collection of mixins designed to augment{' '}
      <code>HTMLElement</code> to serve 90% of use cases for 90% of components.
      It can be paired with other mixins, such as those found in{' '}
      <a href="https://www.polymer-project.org/">Polymer</a>.
    </p>
    <Tabs.is items={examples} />
    <Hr.is />
    <h2>Renderers</h2>
    <p>
      Because Skate provides a hook for renderers, it can support any view
      library such as React, Preact, Vue and more.
    </p>
    <p>
      We've already provided a few renderers for popular front-end libraries:
      <ul>
        <li>
          <a href="https://github.com/skatejs/renderer-react">
            <code>@skatejs/renderer-react</code>
          </a>
        </li>
        <li>
          <a href="https://github.com/skatejs/renderer-preact">
            <code>@skatejs/renderer-preact</code>
          </a>
        </li>
        <li>
          <a href="https://github.com/skatejs/renderer-lit-html">
            <code>@skatejs/renderer-lit-html</code>
          </a>
        </li>
      </ul>
    </p>
  </div>
));
