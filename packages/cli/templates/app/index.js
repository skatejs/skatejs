const outdent = require('outdent');

module.exports = {
  '.babelrc': {
    plugins: [
      ['transform-builtin-classes', { globals: ['HTMLElement'] }],
      'transform-decorators-legacy',
      'transform-skate-flow-props'
    ],
    presets: ['env', 'flow', 'react', 'stage-0']
  },
  'package.json': {
    private: true,
    dependencies: {
      skatejs: '*'
    },
    devDependencies: {
      '@skatejs/bore': '*',
      '@skatejs/ssr': '*',
      '@skatejs/val': '*',
      'babel-jest': '*',
      'babel-plugin-transform-builtin-classes': '^*',
      'babel-plugin-transform-decorators-legacy': '*',
      'babel-plugin-transform-skate-flow-props': '*',
      'babel-polyfill': '*',
      'babel-preset-env': '*',
      'babel-preset-flow': '*',
      'babel-preset-react': '*',
      'babel-preset-stage-0': '*',
      conartist: '*',
      jest: '*',
      'parcel-bundler': '*'
    },
    jest: {
      testEnvironment: '@skatejs/ssr/jest',
      transformIgnorePatterns: []
    },
    scripts: {
      build: 'parcel build src/index.html',
      start: 'parcel src/index.html'
    }
  },
  'src/index.html': outdent`
    <x-hello name="You"></x-hello>
    <script src="https://unpkg.com/@webcomponents/webcomponentsjs@1.1.0/custom-elements-es5-adapter.js"></script>
    <script src="./index.js"></script>
  `,
  'src/__tests__/index.js': outdent`
    /* @jsx h */

    import 'babel-polyfill';
    import { mount } from '@skatejs/bore';
    import { h } from '@skatejs/val';
    import Hello from '..';

    test('render', async () => {
      const elem = mount(<Hello name="You" />);
      await elem.wait();
      expect(elem.node.shadowRoot.innerHTML).toMatchSnapshot();
    });
  `
};
