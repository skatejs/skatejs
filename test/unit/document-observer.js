'use strict';

import globals from '../../src/globals';
import observer from '../../src/document-observer';

describe('Document Observer', function () {
  function getObserver () {
    return globals.observer;
  }

  function hasObserver () {
    return !!getObserver();
  }

  function mockObserver () {
    globals.observer = {
      observe: function () {},
      disconnect: function () {},
      takeRecords: function () {}
    };

    return getObserver();
  }

  afterEach(function () {
    observer.unregister();
  });

  it('should register an observer', function () {
    expect(hasObserver()).to.equal(false);
    observer.register();
    expect(hasObserver()).to.equal(true);
  });

  it('should unregister an observer', function () {
    observer.register().unregister();
    expect(hasObserver()).to.equal(false);
  });

  it('should not overwrite an existing observer', function () {
    var oldObserver = mockObserver();

    observer.register();
    expect(getObserver()).to.equal(oldObserver);
  });
});
