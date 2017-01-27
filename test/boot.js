/* eslint-env jasmine, mocha */

// We include these manually because ShadyCSS adds extra output which the tests
// arent't expecting. We also have to put the native-shim through babel because
// it's being pulled in from the node_modules directory which is excluded by
// default.
require('array.from').shim();
require('object.assign').shim();
require('es6-promise').polyfill();
require('@webcomponents/custom-elements');
require('@webcomponents/shadydom');
const fixture = require('./lib/fixture').default;

// eslint-disable-next-line no-undef
mocha.setup({ timeout: 10000 });

afterEach(() => {
  // Ensure perf tests have enough time to cleanup after themselves.
  // eslint-disable-next-line no-undef
  mocha.timeout(120000);
  fixture('');
});
