import observer from '../../src/native/document-observer';

describe('Document Observer', function () {
  let localObserver;

  function getObserver () {
    return (localObserver || observer).observer;
  }

  function hasObserver () {
    return !!getObserver();
  }

  function mockObserver () {
    localObserver = {
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
    const oldObserver = mockObserver();
    observer.register();
    expect(getObserver()).to.equal(oldObserver);
  });

  it('should throw an error if a MutationObserver implementation isn\'t found', function () {
    const oldMutationObserver = window.MutationObserver;
    window.MutationObserver = undefined;
    try {
      observer.register();
    } catch (e) {
      expect(e.message).to.equal('Mutation Observers are not supported by this browser. Skate requires them in order to polyfill the behaviour of Custom Elements. If you want to support this browser you should include a Mutation Observer polyfill before Skate.');
    }
    window.MutationObserver = oldMutationObserver;
  });
});
