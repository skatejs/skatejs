'use strict';

import helpers from '../lib/helpers';
import skate from '../../src/skate';

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

  function assertCalls () {
    expect(created).to.equal(0);
    expect(attached).to.equal(0);
  }

  beforeEach(function () {
    created = 0;
    attached = 0;
    tag = helpers.safeTagName();
  });

  it('should ignore a flagged element if defined after it is inserted', function () {
    helpers.fixture(`<${tag.safe} data-skate-ignore></${tag.safe}>`);
    skate(tag.safe, definition);
    skate.init(document.getElementsByTagName(tag.safe));
    assertCalls();
  });

  it('should ignore a flagged element if defined before it is inserted', function () {
    skate(tag.safe, definition);
    helpers.fixture(`<${tag.safe} data-skate-ignore></${tag.safe}>`);
    skate.init(document.getElementsByTagName(tag.safe));
    assertCalls();
  })

  it('should ignore children of a flagged element if defined after it is inserted', function () {
    helpers.fixture(`<div data-skate-ignore><${tag.safe}></${tag.safe}></div>`);
    skate(tag.safe, definition);
    skate.init(helpers.fixture());
    assertCalls();
  });

  it('should ignore children of a flagged element if defined before it is inserted', function () {
    skate(tag.safe, definition);
    helpers.fixture(`<div data-skate-ignore><${tag.safe}></${tag.safe}></div>`);
    skate.init(helpers.fixture());
    assertCalls();
  });

  it('should ignore descendants of a flagged element if defined after it is inserted', function () {
    helpers.fixture(`<div data-skate-ignore><div><${tag.safe}></${tag.safe}></div></div>`);
    skate(tag.safe, definition);
    skate.init(helpers.fixture());
    assertCalls();
  });

  it('should ignore descendants of a flagged element if defined before it is inserted', function () {
    skate(tag.safe, definition);
    helpers.fixture(`<div data-skate-ignore><div><${tag.safe}></${tag.safe}></div></div>`);
    skate.init(helpers.fixture());
    assertCalls();
  });
});
