const outdent = require('outdent');

module.exports = {
  'package.json': {
    dependencies: {
      '@skatejs/element': '^0.0.0',
      '@skatejs/element-react': '^0.2.1',
      react: '^16.6.3',
      'react-dom': '^16.6.3'
    }
  },
  'src/index.js': outdent`
    /** @jsx h */

    import Element, { h } from '@skatejs/element-react';

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
