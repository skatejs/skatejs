const outdent = require('outdent');

module.exports = {
  'package.json': {
    dependencies: {
      '@skatejs/renderer-react': '*',
      react: '*',
      'react-dom': '*'
    }
  },
  'src/index.js': outdent`
    import React, { Fragment } from 'react';
    import withRenderer from '@skatejs/renderer-react';
    import { define, props, withComponent } from 'skatejs';

    @define
    class Hello extends withComponent(withRenderer()) {
      static is = 'x-hello';
      static props = {
        name: props.string
      };
      render({ name }) {
        return (
          <Fragment>
            Hey, <strong>{name}</strong>!
          </Fragment>
        );
      }
    }

    export default Hello;
  `
};
