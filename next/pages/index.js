/* @jsx h */

import Element, { h } from "@skatejs/element-react";

class Hello extends Element {
  render() {
    return (
      <div>
        Hello, <slot />!
      </div>
    );
  }
}

export default () => <Hello>You</Hello>;
