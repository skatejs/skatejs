import fixture from '../../lib/fixture';
import getClosestIgnoredElement from '../../../src/util/get-closest-ignored-element';

describe('util/get-closest-ignored-element', function () {
  it('should not fail called on an element in an iframe', function () {
    var iframe = document.createElement('iframe');
    var descendant = document.createElement('div');
    fixture().appendChild(iframe);
    var doc = (iframe.contentDocument || iframe.contentWindow.document);
    if (!doc.body) {
      // iframe <body> does not get initalised correctly in older IE's
      doc.write('<body></body>');
    }
    doc.body.appendChild(descendant);
    expect(getClosestIgnoredElement(descendant)).to.equal(undefined);
  });
});
