import observer from '../../src/document-observer';

describe('Document Observer', function () {
  function getObserver () {
    return window.__skateDocumentObserver;
  }

  function hasObserver () {
    return !!getObserver();
  }

  function mockObserver () {
    window.__skateDocumentObserver = {
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
    expect(hasObserver()).to.be.false;
    observer.register();
    expect(hasObserver()).to.be.true;
  });

  it('should unregister an observer', function () {
    observer.register().unregister();
    expect(hasObserver()).to.be.false;
  });

  it('should not overwrite an existing observer', function () {
    var oldObserver = mockObserver();

    observer.register();
    expect(getObserver()).to.equal(oldObserver);
  });
});
