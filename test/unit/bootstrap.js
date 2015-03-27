'use strict';

import '../polyfill/create-element';
import helpers from '../lib/helpers';
import observer from '../../src/polyfill/document-observer';
import registry from '../../src/polyfill/registry';

afterEach(function () {
  observer.unregister();
  helpers.fixture('');
});
