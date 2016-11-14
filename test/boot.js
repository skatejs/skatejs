/* eslint-env jasmine, mocha */

import 'skatejs-web-components';
import helperFixture from './lib/fixture';

// eslint-disable-next-line no-undef
mocha.setup({ timeout: 10000 });

afterEach(() => {
  // Ensure perf tests have enough time to cleanup after themselves.
  // eslint-disable-next-line no-undef
  mocha.timeout(120000);
  helperFixture('');
});
