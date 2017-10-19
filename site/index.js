/** @jsx h */

import { define } from '../src';
import { Code, Component, Heading, Hero, Layout, h } from './components/_';
import loadSample from './utils/load-sample';

export default define(
  class Index extends Component {
    renderCallback() {
      return (
        <Layout>
          <Hero />
          <Code {...loadSample('simple')} />
          <p>
            Because Skate provides a hook for renderers, it can support any view
            library such as React, Preact, Vue and more.
          </p>
          <p>
            The Skate team have provided a few renderers for popular front-end
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
        </Layout>
      );
    }
  }
);
