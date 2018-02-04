const outdent = require('outdent');

module.exports = {
  'package.json': {
    dependencies: {
      '@skatejs/renderer-lit-html': '*',
      'lit-html': '*'
    }
  },
  'src/index.js': outdent`
    import { html } from 'lit-html/lib/lit-extended';
    import withRenderer from '@skatejs/renderer-lit-html';
    import { define, props, withComponent } from 'skatejs';

    @define
    class Hello extends withComponent(withRenderer()) {
      static is = 'x-hello';
      static props = {
        name: props.string
      };
      render({ name }) {
        return html\`Hey, <strong>\${name}</strong>!\`;
      }
    }

    export default Hello;
  `
};
