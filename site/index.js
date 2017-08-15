/** @jsx h */

import { Component, define } from "../src";
import { Code, Heading, Hero, Layout, h } from "./components/_";

export default define(
  class extends Component {
    renderCallback() {
      return (
        <Layout>
          <Hero>
            <Heading>SkateJS</Heading>
            <p>Basic usage:</p>
            <Code
              src={`
              /** @jsx h */

              import { Component, h } from 'skatejs';

              class MyComponent extends Component {
                renderCallback () {
                  return <div>Hello, <slot />!</div>;
                }
              }
            `}
            />
            <p>Would render:</p>
            <Code src={`Hello, World!`} />
          </Hero>
          <p>To install Skate, all you have to do is run:</p>
          <Code src={`npm install skatejs preact`} />
          <p>
            Skate uses Preact as its default renderer when you extend{" "}
            <code>Component</code>. You don't have to do this if you're using a
            custom renderer.
          </p>
        </Layout>
      );
    }
  }
);
