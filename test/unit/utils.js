'use strict';

import helpers from '../lib/helpers';
import { getClosestIgnoredElement } from '../../src/utils';

describe('utils', function () {
  describe('getClosestIgnoredElement()', function () {
    it('should not fail called on an element in an iframe', function () {
      var iframe = document.createElement('iframe');
      var descendant = document.createElement('div');
      helpers.fixture().appendChild(iframe);
      var doc = (iframe.contentDocument || iframe.contentWindow.document);
      if (!doc.body) {
        // iframe <body> does not get initalised correctly in older IE's
        doc.write('<body></body>');
      }
      doc.body.appendChild(descendant);
      getClosestIgnoredElement(descendant);
    });
  });
});
