/** @jsx h */

import { Component, define, h } from "../src";
import { Code } from "./components/code";
import { Heading } from "./components/heading";

export default define(
  class extends Component {
    renderCallback() {
      return (
        <div>
          <Heading>SkateJS</Heading>
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
        </div>
      );
    }
  }
);
