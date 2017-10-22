import {
  Code,
  Example,
  Heading,
  Hero,
  Hr,
  Layout,
  Runnable,
  Tabs
} from './components';
import { Component, h, sample, script, style } from './utils';
import { define, props } from '../src';

const sampleWithComponent = sample('with-component');

const Sample = ({ code, html }) => {
  return (
    <div>
      <Code.is code={code} lang="js" />
      <Code.is code={html} lang="html" />
    </div>
  );
};

const examples = [
  {
    name: 'withComponent',
    pane: [
      <p>
        The <code>withComponent</code> mixin combines all of Skate's mixins into
        a single one for easy use.
      </p>,
      <Runnable.is {...sample('with-component')} />
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
      <Runnable.is {...sample('with-unique')} />
    ]
  }
];

const Index = define(
  class Index extends Component {
    connectedCallback() {
      super.connectedCallback();
      script(
        'https://unpkg.com/@webcomponents/webcomponentsjs@1.0.17/custom-elements-es5-adapter.js'
      );
      script('index.js');
    }
    renderCallback() {
      return (
        <Layout.is>
          {style(
            this,
            `
            .code {
              margin: 0 auto;
              max-width: 600px;
            }
          `
          )}
          <Hero.is />
          <Code.is {...sample('with-react')} class="code" />
          <Hr.is />
          <h2>Mixins</h2>
          <p>
            The{' '}
            <a href="http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/">
              mixin
            </a>{' '}
            pattern is a way to compose together functionality from several
            abstract classes into a single one. Skate is a collection of mixins
            designed to augment <code>HTMLElement</code> to get you 90% of the
            way there for 90% of your components. It can be paired with other
            mixins, such as those found in{' '}
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
            We've already provided a few renderers for popular front-end
            libraries:
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
        </Layout.is>
      );
    }
  }
);

document.body.appendChild(new Index());

export default class {
  constructor() {
    return document;
  }
}
