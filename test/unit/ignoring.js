'use strict';

import helpers from '../lib/helpers';
import skate from '../../src/skate';

describe('ignoring', function () {
  it('should ignore a flagged element if defined after it is inserted', function () {
    var called = 0;
    var tag = helpers.safeTagName();

    helpers.fixture(`<${tag.safe} data-skate-ignore></${tag.safe}>`);
    skate(tag.safe, {
      created: function () {
        ++called;
      }
    });
    skate.init(document.getElementsByTagName(tag.safe));
    expect(called).to.equal(0);
  });

  it('should ignore a flagged element if defined before it is inserted', function () {
    var called = 0;
    var tag = helpers.safeTagName();

    skate(tag.safe, {
      created: function () {
        ++called;
      }
    });
    helpers.fixture(`<${tag.safe} data-skate-ignore></${tag.safe}>`);
    skate.init(document.getElementsByTagName(tag.safe));
    expect(called).to.equal(0);
  })

  it('should ignore children of a flagged element if defined after it is inserted', function () {
    var called = 0;
    var tag = helpers.safeTagName();

    helpers.fixture(`<div data-skate-ignore><${tag.safe}></${tag.safe}></div>`);
    skate(tag.safe, {
      created: function () {
        ++called;
      }
    });
    skate.init(helpers.fixture());
    expect(called).to.equal(0);
  });

  it('should ignore children of a flagged element if defined before it is inserted', function () {
    var called = 0;
    var tag = helpers.safeTagName();

    skate(tag.safe, {
      created: function () {
        ++called;
      }
    });
    helpers.fixture(`<div data-skate-ignore><${tag.safe}></${tag.safe}></div>`);
    skate.init(helpers.fixture());
    expect(called).to.equal(0);
  });

  it('should ignore descendants of a flagged element if defined after it is inserted', function () {
    var called = 0;
    var tag = helpers.safeTagName();

    helpers.fixture(`<div data-skate-ignore><div><${tag.safe}></${tag.safe}></div></div>`);
    skate(tag.safe, {
      created: function () {
        ++called;
      }
    });
    skate.init(helpers.fixture());
    expect(called).to.equal(0);
  });

  it('should ignore descendants of a flagged element if defined before it is inserted', function () {
    var called = 0;
    var tag = helpers.safeTagName();

    skate(tag.safe, {
      created: function () {
        ++called;
      }
    });
    helpers.fixture(`<div data-skate-ignore><div><${tag.safe}></${tag.safe}></div></div>`);
    skate.init(helpers.fixture());
    expect(called).to.equal(0);
  });
});
