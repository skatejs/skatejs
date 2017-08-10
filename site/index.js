/** @jsx h */

import { Component, define, h } from "../src";

export default define(
  class extends Component {
    renderCallback() {
      return <h1>Testing...</h1>;
    }
  }
);
