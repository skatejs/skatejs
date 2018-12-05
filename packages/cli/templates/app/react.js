const outdent = require('outdent');

module.exports = {
  'package.json': {
    dependencies: {
      '@skatejs/component': '^0.0.0',
      '@skatejs/renderer-react': '^0.2.1',
      react: '^16.6.3',
      'react-dom': '^16.6.3'
    }
  },
  'src/index.js': outdent`
    /** @jsx h */

    import Component, { h } from '@skatejs/renderer-react';

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
