const outdent = require('outdent');

module.exports = {
  'tsconfig.json': {},
  'package.json': {
    private: true,
    dependencies: {},
    devDependencies: {
      '@skatejs/bore': '^4.0.3',
      '@skatejs/ssr': '^0.19.1',
      jest: '23.6.0',
      'jest-cli': '23.6.0',
      'parcel-bundler': '^1.9.7'
    },
    jest: {
      testEnvironment: './packages/ssr/jest',
      transformIgnorePatterns: [],
      transform: {
        '^.+\\.tsx?$': 'ts-jest'
      },
      testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
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
    import mount from '@skatejs/bore';
    import { h } from '@skatejs/val';
    import Hello from '..';

    test('render', async () => {
      const elem = mount(<Hello name="You" />);
      await elem.wait();
      expect(elem.node.shadowRoot.innerHTML).toMatchSnapshot();
    });
  `
};
