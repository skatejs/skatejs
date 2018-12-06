const outdent = require('outdent');

module.exports = {
  'package.json': {
    dependencies: {
      '@skatejs/element': '^0.0.0',
      '@skatejs/element-lit-html': '^0.2.0',
      'lit-html': 'dev'
    }
  },
  'src/index.js': outdent`
    import Element, { html } from '@skatejs/element-lit-html';

    export default class extends Element {
      static props = {
        name: String
      };
      render() {
        return html\`Hey, <strong>\${this.name}</strong>!\`;
      }
    }
  `
};
