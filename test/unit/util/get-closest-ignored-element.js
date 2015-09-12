import fixture from '../../lib/fixture';
import getClosestIgnoredElement from '../../../src/util/get-closest-ignored-element';

describe('util/get-closest-ignored-element', function () {
  it('should not fail called on an element in an iframe', function () {
    var iframe = document.createElement('iframe');
    var descendant = document.createElement('div');
    fixture().appendChild(iframe);
    iframe.contentDocument.body.appendChild(descendant);
    expect(getClosestIgnoredElement(descendant)).to.equal(undefined);
  });
});
