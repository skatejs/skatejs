'use strict';

import 'skatejs-polyfill-mutation-observer';
import helperFixture from './lib/fixture';
import observer from '../src/global/document-observer';

afterEach(function () {
  // Ensure perf tests have enough time to cleanup after themselves.
  this.timeout(120000);
  observer.unregister();
  helperFixture('');
});
