'use strict';

import helperElement from '../lib/element';
import helperFixture from '../lib/fixture';
import skate from '../../src/index';

describe('lifecycle/attributes', function () {
  describe('Callback', function () {
    it('should call the callback just like attributeChangedCallback', function () {
      var data;
      var tag = helperElement();

      skate(tag.safe, {
        attribute: (...args) => data = args
      });

      var elem = tag.create();

      elem.setAttribute('name', 'created');
      expect(data[0]).to.equal('name');
      expect(data[1]).to.equal(null);
      expect(data[2]).to.equal('created');

      elem.setAttribute('name', 'updated');
      expect(data[0]).to.equal('name');
      expect(data[1]).to.equal('created');
      expect(data[2]).to.equal('updated');

      elem.removeAttribute('name');
      expect(data[0]).to.equal('name');
      expect(data[1]).to.equal('updated');
      expect(data[2]).to.equal(null);
    });
  });

  describe('Attributes added via HTML', function () {
    it('should ensure the callback is called for attributes already on the element when it is initialised', function () {
      var called = false;
      var tag = helperElement();

      skate(tag.safe, {
        attribute: () => called = true
      });

      tag.create();
      expect(called).to.equal(true);
    });
  });
});
