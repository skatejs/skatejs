/** @jsx h */

import { define } from '../src';
import { Code, Component, Heading, Hero, Hr, Layout, h } from './components/_';
import loadSample from './utils/load-sample';

export default define(
  class Index extends Component {
    renderCallback() {
      return (
        <Layout>
          <Hero />
          <Code {...loadSample('with-react')} />
          <Hr />
          <h2>Why Skate?</h2>
          <p>The purpose of Skate is to:</p>
          <ul>
            <li>Be a set of mixins for all the common things you'd end up having to write yourself.</li>
            <li>Provide an abstract functional - as in FRP - rendering pattern that can hook into <strong>any</strong> view library.</li>
            <li>Stay small, focused and compatible with any library / framework.</li>
          </ul>
          <Hr />
          <h2>Common mixins</h2>
          <Hr />
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
        </Layout>
      );
    }
  }
);
