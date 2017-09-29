/** @jsx h */

import { define } from "../src";
import { Code, Component, Heading, Hero, Layout, h } from "./components/_";
import loadSample from "./utils/load-sample";

const simple = loadSample('simple');

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
              src={simple.source}
            />
            <Code
              lang="html"
              src={simple.html}
            />
            <p>Would render:</p>
            <Code lang="html" src={simple.result} />
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
