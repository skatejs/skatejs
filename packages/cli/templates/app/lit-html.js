const outdent = require('outdent');

module.exports = {
  'package.json': {
    dependencies: {
      '@skatejs/component': '^0.0.0',
      '@skatejs/renderer-lit-html': '^0.2.0',
      'lit-html': 'dev'
    }
  },
  'src/index.js': outdent`
    import Component, { html } from '@skatejs/renderer-lit-html';

    export default class extends Component {
      static props = {
        name: String
      };
      render() {
        return html\`Hey, <strong>\${this.name}</strong>!\`;
      }
    }
  `
};
