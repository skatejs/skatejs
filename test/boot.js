'use strict';

import helpers from './lib/helpers';
import observer from '../src/polyfill/document-observer';

afterEach(function () {
  // Ensure perf tests have enough time to cleanup after themselves.
  this.timeout(120000);
  observer.unregister();
  helpers.fixture('');
});
