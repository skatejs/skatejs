'use strict';

import globals from '../../src/global/vars';
import observer from '../../src/global/document-observer';

describe('Document Observer', function () {
  function getObserver () {
    return globals.observer.observer;
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

  it('should throw an error if a MutationObserver implementation isn\'t found', function () {
    const oldMutationObserver = window.MutationObserver;
    window.MutationObserver = undefined;
    expect(observer.register).to.throw('Mutation Observers are not supported by this browser. Skate requires them in order to polyfill the behaviour of Custom Elements. If you want to support this browser you should include a Mutation Observer polyfill before Skate.');
    window.MutationObserver = oldMutationObserver;
  });
});
