const outdent = require('outdent');

module.exports = {
  'package.json': {
    dependencies: {
      '@skatejs/renderer-preact': '*',
      preact: '*'
    }
  },
  'src/index.js': outdent`
    /* @jsx h */

    import { h } from 'preact';
    import withRenderer from '@skatejs/renderer-preact';
    import { define, props, withComponent } from 'skatejs';

    @define
    class Hello extends withComponent(withRenderer()) {
      static is = 'x-hello';
      static props = {
        name: props.string
      };
      render({ name }) {
        return (
          <div>
            Hey, <strong>{name}</strong>!
          </div>
        );
      }
    }

    export default Hello;
  `
};
