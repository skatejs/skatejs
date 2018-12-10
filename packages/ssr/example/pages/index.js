const { define, Component } = require('skatejs');
const outdent = require('outdent');

class Hello extends Component {
  render() {
    return outdent`
      <span class="test">
        Hello,
        <x-yell><slot></slot></x-yell>!
      </span>
    `;
  }
}

class Index extends Component {
  render() {
    return outdent`
      <div class="test">
        <h1>SkateJS</h1>
        <p><x-hello>World</x-hello></p>
      </div>
    `;
  }
}

class Yell extends Component {
  render() {
    return outdent`
      <style>.test { font-weight: bold; }</style>
      <span class="test"><slot></slot></span>
    `;
  }
}

[Hello, Index, Yell].forEach(define);

module.exports = Index;
