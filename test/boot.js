'use strict';

import helpers from './lib/helpers';
import observer from '../src/polyfill/document-observer';

afterEach(function () {
  observer.unregister();
  helpers.fixture('');
});
