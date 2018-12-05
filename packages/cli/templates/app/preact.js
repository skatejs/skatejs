const outdent = require('outdent');

module.exports = {
  'package.json': {
    dependencies: {
      '@skatejs/component': '^0.0.0',
      '@skatejs/renderer-preact': '^0.2.5',
      preact: '^8.2.7'
    }
  },
  'src/index.js': outdent`
    /** @jsx h */

    import Component, { h } from '@skatejs/renderer-preact';

    export default class extends Component {
      static props = {
        name: String
      };
      render() {
        return <span>Hey, <strong>{this.name}</strong>!</span>;
      }
    }
  `
};
