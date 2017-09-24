/** @jsx h */

import { define } from "../src";
import { Code, Component, Heading, Hero, Layout, h } from "./components/_";

export default define(
  class Index extends Component {
    renderCallback() {
      return (
        <Layout>
          <Hero>
            <Heading>SkateJS</Heading>
            <p>Basic usage:</p>
            <Code
              lang="js"
              src={`
              import { withComponent, withRenderer } from 'skatejs';

              let Component = withComponent(withRenderer());

              class MyComponent extends Component {
                  rendererCallback (renderRoot, renderCallback) {
                    renderRoot.innerHtml = '';
                    renderRoot.appendChild(renderCallback());
                  }
                  renderCallback () {
                      let el = document.createElement('div');
                      el.innerHTML = 'Hello, <slot></slot>!';
                      return el;
                  }
              }

              customElements.define('my-component', MyComponent);
              `}
            />
            <Code
              lang="html"
              src={`
                <my-component>World</my-component>
              `}
            />
            <p>Would render:</p>
            <Code lang="html" src={`Hello, World!`} />
          </Hero>
          <p>To install Skate, all you have to do is run:</p>
          <Code lang="sh" src={`npm install skatejs`} />
          <p>
            Because Skate provides a hook for the renderer, it can support just about
            every modern component-based front-end library &mdash; React, Preact, Vue...
            just provide the <code>rendererCallback</code> and it's all the same to Skate!
          </p>
          <p>
            The Skate team have provided a few renderers for popular front-end libraries:
            <ul>
              <li><a href="https://github.com/skatejs/renderer-react"><code>@skatejs/renderer-react</code></a></li>
              <li><a href="https://github.com/skatejs/renderer-preact"><code>@skatejs/renderer-preact</code></a></li>
              <li><a href="https://github.com/skatejs/renderer-lit-html"><code>@skatejs/renderer-lit-html</code></a></li>
            </ul>
          </p>
        </Layout>
      );
    }
  }
);
