import helperElement from '../lib/element';
import helperFixture from '../lib/fixture';
import skate, { init, ready } from '../../src/index';

describe('lifecycle', function () {
  var MyEl;
  var myEl;
  var tagName;
  var created = false;
  var attached = false;
  var detached = false;

  beforeEach(function () {
    tagName = helperElement('my-el');
    created = false;
    attached = false;
    detached = false;
    MyEl = skate(tagName.safe, {
      created: function () {
        created = true;
      },
      attached: function () {
        attached = true;
      },
      detached: function () {
        detached = true;
      }
    });
    myEl = new MyEl();
  });

  it('should call the created() callback when the element is created', function () {
    expect(created).to.equal(true);
    expect(attached).to.equal(false);
    expect(detached).to.equal(false);
  });

  it('should call the attached() callback when the element is attached', function (done) {
    helperFixture().appendChild(myEl);
    setTimeout(function () {
      expect(created).to.equal(true);
      expect(attached).to.equal(true);
      expect(detached).to.equal(false);
      done();
    }, 1);
  });

  it('should call the detached() callback when the element is detached', function (done) {
    helperFixture().appendChild(myEl);
    ready(myEl, function () {
      helperFixture().removeChild(myEl);
      setTimeout(function () {
        expect(created).to.equal(true);
        expect(attached).to.equal(true);
        expect(detached).to.equal(true);
        done();
      }, 1);
    });
  });

  it('should not call the attached() callback when the element is initialised', function () {
    init(myEl);
    expect(created).to.equal(true);
    expect(attached).to.equal(false);
    expect(detached).to.equal(false);
  });
});

describe('unresolved attribute', function () {
  it('should not be considred "resolved" until after ready() is called', function () {
    var tagName = helperElement('my-element');
    skate(tagName.safe, {
      ready: function (elem) {
        expect(elem.hasAttribute('unresolved')).to.equal(true);
        expect(elem.hasAttribute('resolved')).to.equal(false);
      }
    });

    init(helperFixture('<my-element unresolved></my-element>', tagName));
  });

  it('should be considred "resolved" after the created lifecycle finishes', function () {
    var tag = helperElement('my-element').safe;
    skate(tag, {
      created: function (elem) {
        expect(elem.hasAttribute('defined')).to.equal(false, 'should not have resolved');
      }
    });

    var element = helperFixture(`<${tag}></${tag}>`).children[0];
    init(element);
    expect(element.hasAttribute('defined')).to.equal(true, 'should have defined');
  });
});

describe('lifecycle scenarios', function () {
  var calls;
  var El;

  beforeEach(function () {
    calls = {
      created: 0,
      attached: 0,
      detached: 0
    };

    var { safe: tagName } = helperElement('my-element');
    El = skate(tagName, {
      created: function () {
        ++calls.created;
      },
      attached: function () {
        ++calls.attached;
      },
      detached: function () {
        ++calls.detached;
      }
    });
  });

  describe('use the constructor then add it to the DOM', function () {
    let myEl;

    beforeEach(function () {
      myEl = new El();
      helperFixture(myEl);
    });

    it('should call created', function (done) {
      ready(myEl, function () {
        expect(calls.created).to.be.greaterThan(0);
        done();
      });
    });

    it('should call attached', function (done) {
      ready(myEl, function () {
        setTimeout(function () {
          expect(calls.attached).to.be.greaterThan(0);
          done();
        }, 1);
      });
    });
  });

  describe('attached multiple times', function () {
    function expectNumCalls (num, val, done) {
      var el = new El();

      el.textContent = 'gagas';

      helperFixture(el);
      ready(el, function () {
        helperFixture().removeChild(el);
        setTimeout(function () {
          helperFixture(el);
          setTimeout(function () {
            helperFixture().removeChild(el);
            setTimeout(function () {
              expect(calls[num]).to.equal(val, num);
              done();
            }, 1);
          }, 1);
        }, 1);
      });
    }

    it('should have called created only once', function (done) {
      expectNumCalls('created', 1, done);
    });

    it('should have called attached twice', function (done) {
      expectNumCalls('attached', 2, done);
    });

    it('should have called detached twice', function (done) {
      expectNumCalls('detached', 2, done);
    });
  });

  describe('timing', function () {
    it('should call lifecycle callbacks at appropriate times.', function (done) {
      var created = false;
      var attached = false;
      var detached = false;
      var tag = helperElement('my-el');

      skate(tag.safe, {
        created: function () {
          created = true;
        },
        attached: function () {
          attached = true;
        },
        detached: function () {
          detached = true;
        }
      });

      var element = tag.create();
      expect(created).to.equal(true, 'Should call created');
      expect(attached).to.equal(false, 'Should not call attached');
      expect(detached).to.equal(false, 'Should not call detached');

      document.body.appendChild(element);
      init(element);
      expect(attached).to.equal(true, 'Should call attached');
      expect(detached).to.equal(false, 'Should not call remove');

      element.parentNode.removeChild(element);

      setTimeout(function () {
        expect(detached).to.equal(true, 'Should call detached');
        done();
      }, 1);
    });

    it('should initialise multiple instances of the same type of element (possible bug).', function (done) {
      var numCreated = 0;
      var numAttached = 0;
      var numDetached = 0;
      var tag = helperElement('my-el');
      var Element = skate(tag.safe, {
        created: function () {
          ++numCreated;
        },
        attached: function () {
          ++numAttached;
        },
        detached: function () {
          ++numDetached;
        }
      });

      var element1 = new Element();
      var element2 = new Element();

      document.body.appendChild(element1);
      document.body.appendChild(element2);

      // Using setTimeout here gets around an odd issue in Chrome where a
      // native custom element may not have its prototype set up yet. We have
      // to use setTimeout() because skate.ready() errors in Firefox because
      // the MutationObserver will fire after it's ready. Therefore to cover
      // all scenarios we must use setTimeout(). For practical usage, you would
      // be able to use skate.ready().
      setTimeout(function () {
        expect(numCreated).to.equal(2, 'created');
        expect(numAttached).to.equal(2, 'attached');

        element1.parentNode.removeChild(element1);
        element2.parentNode.removeChild(element2);

        // For testing the detached callback in polyfill land.
        setTimeout(function () {
          expect(numDetached).to.equal(2, 'detached');
          done();
        }, 1);
      }, 1);
    });
  });
});
