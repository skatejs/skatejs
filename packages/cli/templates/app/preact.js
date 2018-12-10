const outdent = require('outdent');

module.exports = {
  'package.json': {
    dependencies: {
      '@skatejs/element': '^0.0.0',
      '@skatejs/element-preact': '^0.2.5',
      preact: '^8.2.7'
    }
  },
  'src/index.js': outdent`
    /** @jsx h */

    import Element, { h } from '@skatejs/element-preact';

    export default class extends Element {
      static props = {
        name: String
      };
      render() {
        return <span>Hey, <strong>{this.name}</strong>!</span>;
      }
    }
  `
};
