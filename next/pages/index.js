/* @jsx h */

import Element, { h } from "@skatejs/element-react";
import css from "@skatejs/shadow-css";

const style = css`
  ${".host"} {
    border: 1px solid black;
    display: inline-block;
    padding: 10px;
  }
`;

class App extends Element {
  static get props() {
    return {
      count: Number
    };
  }
  constructor() {
    super();
    this.count = 0;
  }
  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    setInterval(() => {
      this.count += 1;
    }, 1000);
  }
  render() {
    return (
      <div className={style.host}>
        <style>{style.toString()}</style>
        Count: {this.count}
      </div>
    );
  }
}

export default () => <App />;
