/* @jsx h */

import Element, { h } from "@skatejs/element-react";
import css from "@skatejs/shadow-css";

const style = css(`
  :host {
    border: 1px solid black;
    display: inline-block;
    padding: 10px;
  }
`);

class Hello extends Element {
  render() {
    return (
      <div>
        <style>{style(this)}</style>
        Hello, <slot />!
      </div>
    );
  }
}

export default () => <Hello>You</Hello>;
