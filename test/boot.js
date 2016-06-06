// TODO Move this to the Karma config once it's consumable from the dist.
import 'es6-map/polyfill';
import 'webcomponents.js/src/CustomElements/v1/CustomElements';

import helperFixture from './lib/fixture';

mocha.setup({ timeout: 10000 });

afterEach(function () {
  // Ensure perf tests have enough time to cleanup after themselves.
  this.timeout(120000);
  helperFixture('');
});
