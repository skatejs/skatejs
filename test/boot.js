/* eslint-env jasmine, mocha */

import helperFixture from './lib/fixture';

if (!document.registerElement && !window.customElements) {
  require('skatejs-web-components');
}

mocha.setup({ timeout: 10000 }); // eslint-disable-line no-undef

afterEach(() => {
  // Ensure perf tests have enough time to cleanup after themselves.
  mocha.timeout(120000); // eslint-disable-line no-undef
  helperFixture('');
});
