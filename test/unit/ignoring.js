'use strict';

import helperElement from '../lib/element';
import helperFixture from '../lib/fixture';
import skate from '../../src/index';
import supportsCustomElements from '../../src/support/custom-elements';

describe('ignoring', function () {
  var created;
  var attached;
  var tag;
  var definition = {
    created: function () {
      ++created;
    },
    attached: function () {
      ++attached;
    }
  };

  function assertCalls (done) {
    setTimeout(function () {
      var expected = supportsCustomElements() ? 1 : 0;
      expect(created).to.equal(expected, 'created');
      expect(attached).to.equal(expected, 'attached');
      done();
    });
  }

  beforeEach(function () {
    created = 0;
    attached = 0;
    tag = helperElement();
  });

  it('should ignore a flagged element if defined after it is inserted', function (done) {
    helperFixture(`<${tag.safe} data-skate-ignore></${tag.safe}>`);
    skate(tag.safe, definition);
    assertCalls(done);
  });

  it('should ignore a flagged element if defined before it is inserted', function (done) {
    skate(tag.safe, definition);
    helperFixture(`<${tag.safe} data-skate-ignore></${tag.safe}>`);
    assertCalls(done);
  });

  it('should ignore children of a flagged element if defined after it is inserted', function (done) {
    helperFixture(`<div data-skate-ignore><${tag.safe}></${tag.safe}></div>`);
    skate(tag.safe, definition);
    assertCalls(done);
  });

  it('should ignore children of a flagged element if defined before it is inserted', function (done) {
    skate(tag.safe, definition);
    helperFixture(`<div data-skate-ignore><${tag.safe}></${tag.safe}></div>`);
    assertCalls(done);
  });

  it('should ignore descendants of a flagged element if defined after it is inserted', function (done) {
    helperFixture(`<div data-skate-ignore><div><${tag.safe}></${tag.safe}></div></div>`);
    skate(tag.safe, definition);
    assertCalls(done);
  });

  it('should ignore descendants of a flagged element if defined before it is inserted', function (done) {
    skate(tag.safe, definition);
    helperFixture(`<div data-skate-ignore><div><${tag.safe}></${tag.safe}></div></div>`);
    assertCalls(done);
  });
});
