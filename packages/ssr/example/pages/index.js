/** @jsx vh */

const { Component, define, h, withUnique } = require('skatejs');
const vh = require('@skatejs/val').default(h);

class Yell extends withUnique() {
  connectedCallback() {
    this.attachShadow({ mode: 'open' }).innerHTML = `
      <style>.test { font-weight: bold; }</style>
      <span class="test"><slot></slot></span>
    `;
  }
}

class Hello extends Component {
  renderCallback() {
    return (
      <span className="test">
        Hello,{' '}
        <Yell>
          <slot />
        </Yell>!
      </span>
    );
  }
}

[Yell, Hello].forEach(define);

module.exports = define(
  class Index extends Component {
    renderCallback() {
      return (
        <div className="test">
          <h1>SkateJS</h1>
          <p>
            <Hello>World</Hello>
          </p>
        </div>
      );
    }
  }
);
