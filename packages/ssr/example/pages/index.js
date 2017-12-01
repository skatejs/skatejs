const { define, withComponent } = require('skatejs');
const outdent = require('outdent');

class Hello extends withComponent() {
  render() {
    return outdent`
      <span class="test">
        Hello,
        <x-yell><slot></slot></x-yell>!
      </span>
    `;
  }
}

class Index extends withComponent() {
  render() {
    return outdent`
      <div class="test">
        <h1>SkateJS</h1>
        <p><x-hello>World</x-hello></p>
      </div>
    `;
  }
}

class Yell extends withComponent() {
  render() {
    return outdent`
      <style>.test { font-weight: bold; }</style>
      <span class="test"><slot></slot></span>
    `;
  }
}

[Hello, Index, Yell].forEach(define);

module.exports = Index;
