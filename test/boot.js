/* eslint-env jasmine, mocha */

import '@webcomponents/custom-elements';
import '@webcomponents/shadydom';
import fixture from './lib/fixture';

// eslint-disable-next-line no-undef
mocha.setup({ timeout: 10000 });

afterEach(() => {
  // Ensure perf tests have enough time to cleanup after themselves.
  // eslint-disable-next-line no-undef
  mocha.timeout(120000);
  fixture('');
});
