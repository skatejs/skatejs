/* eslint-env jest */

const fixture = require('../lib/fixture');

afterAll(() => {
  // Ensure perf tests have enough time to cleanup after themselves.
  // eslint-disable-next-line no-undef
  mocha.timeout(120000);
  fixture('');
});
