'use strict';

import helpers from '../lib/helpers';
import skate from '../../src/skate';

describe('Lifecycle Callbacks', function () {
  var MyEl;
  var myEl;
  var tagName;
  var created = false;
  var attached = false;
  var detached = false;

  beforeEach(function () {
    tagName = helpers.safeTagName('my-el');
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
    helpers.fixture().appendChild(myEl);
    helpers.afterMutations(function () {
      expect(created).to.equal(true);
      expect(attached).to.equal(true);
      expect(detached).to.equal(false);
      done();
    });
  });

  it('should call the detached() callback when the element is detached', function (done) {
    helpers.fixture().appendChild(myEl);
    helpers.afterMutations(function () {
      helpers.fixture().removeChild(myEl);
      helpers.afterMutations(function () {
        expect(created).to.equal(true);
        expect(attached).to.equal(true);
        expect(detached).to.equal(true);
        done();
      });
    });
  });

  it('should not call the attached() callback when the element is initialised', function () {
    skate.init(myEl);
    expect(created).to.equal(true);
    expect(attached).to.equal(false);
    expect(detached).to.equal(false);
  });
});

describe('Unresolved attribute', function () {
  it('should not be considred "resolved" until after template() is called', function () {
    var tagName = helpers.safeTagName('my-element');
    skate(tagName.safe, {
      template: function (element) {
        expect(element.hasAttribute('unresolved')).to.equal(true);
        expect(element.hasAttribute('resolved')).to.equal(false);
      }
    });

    skate.init(helpers.fixture('<my-element unresolved></my-element>', tagName));
  });

  it('should be considred "resolved" by the time created() is called', function () {
    var tagName = helpers.safeTagName('my-element');
    skate(tagName.safe, {
      created: function (element) {
        expect(element.hasAttribute('unresolved')).to.equal(false);
        expect(element.hasAttribute('resolved')).to.equal(true);
      }
    });

    skate.init(helpers.fixture('<my-element unresolved></my-element>', tagName));
  });
});

describe('Lifecycle scenarios', function () {
  var calls;
  var El;

  beforeEach(function () {
    calls = {
      created: 0,
      attached: 0,
      detached: 0
    };

    var {safe: tagName} = helpers.safeTagName('my-element');
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
    beforeEach(function () {
      helpers.fixture(new El());
    });

    it('should call created', function (done) {
      helpers.afterMutations(function () {
        expect(calls.created).to.greaterThan(0);
        done();
      });
    });

    it('should call attached', function (done) {
      helpers.afterMutations(function () {
        expect(calls.attached).to.greaterThan(0);
        done();
      });
    });
  });

  describe('attached multiple times', function () {
    function expectNumCalls (num, val, done) {
      var el = new El();

      el.textContent = 'gagas';

      helpers.fixture(el);
      helpers.afterMutations(function () {
        helpers.fixture().removeChild(el);
        helpers.afterMutations(function () {
          helpers.fixture(el);
          helpers.afterMutations(function () {
            helpers.fixture().removeChild(el);
            helpers.afterMutations(function () {
              expect(calls[num]).to.equal(val);
              done();
            });
          });
        });
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

  describe('multiple bindings', function () {
    it('should initialise all bindings', function () {
      var id1 = helpers.safeTagName('my-el');
      var id2 = helpers.safeTagName('my-el');
      var created = 0;
      var attached = 0;
      var def = {
        type: skate.type.ATTRIBUTE,
        created: function () { ++created; },
        attached: function () { ++attached; }
      };

      skate(id1.safe, def);
      skate(id2.safe, def);

      skate.init(helpers.fixture(`<div ${id1.safe} ${id2.safe}></div>`));
      expect(created).to.equal(2, 'created');
      expect(attached).to.equal(2, 'attached');
    });
  });

  describe('shared definitions', function () {
    it('should copy the definition so that the shared definition is not modified', function () {
      var id1 = helpers.safeTagName('my-el');
      var id2 = helpers.safeTagName('my-el');
      var created = 0;
      var attached = 0;
      var def = {
        type: skate.type.ATTRIBUTE,
        created: function () { ++created; },
        attached: function () { ++attached; }
      };

      skate(id1.safe, def);
      skate(id2.safe, def);

      skate.init(helpers.fixture(`<div ${id1.safe} ${id2.safe}></div>`));
      expect(created).to.equal(2, 'created');
      expect(attached).to.equal(2, 'attached');
    });
  });

  describe('attribute handlers', function () {

    it('should only call fallback once', function(done) {
      let tagName = helpers.safeTagName('test-toggle');
      let fallbackSpy = sinon.spy(function fallback() {
        expect(fallbackSpy.calledOnce, `Fallback should have been called once, but was called ${fallbackSpy.callCount} times.`).to.be.true;
        done();
      });
      let MyToggle = skate(tagName.safe, {
        attributes: {
          foo: {
            fallback: fallbackSpy
          }
        }
      });
      let myToggle = new MyToggle();

      helpers.afterMutations(function() {
          myToggle.setAttribute('foo', 'bar');
      });
    });

    it('should properly call the removed callback', function(done) {
      let tagName = helpers.safeTagName('test-toggle');
      let fallbackSpy = sinon.spy(function fallback(target, data) {
        expect(fallbackSpy.calledOnce, 'Call fallback once').to.be.true;

        expect(target).to.equal(myToggle);
        expect(data).to.eql({
          type: 'created',
          name: attributeName,
          newValue: '',
          oldValue: null
        });
      });
      let removedSpy = sinon.spy(function removed(target, data) {
        expect(removedSpy.calledOnce, 'Call removed once').to.be.true;
        expect(fallbackSpy.calledBefore(removedSpy), 'Call fallback before remove').to.be.true;

        expect(target).to.equal(myToggle);
        expect(data).to.eql({
          type: 'removed',
          name: attributeName,
          newValue: null,
          oldValue: ''
        });
        done();
      });

      let attributeName = 'checked';

      let attributes = {};
      attributes[attributeName] = {
          removed: removedSpy,
          fallback: fallbackSpy
      };
      let MyToggle = skate(tagName.safe, {
        attributes: attributes
      });
      let myToggle = new MyToggle();

      myToggle.setAttribute(attributeName, '');

      helpers.afterMutations(function() {
        expect(fallbackSpy.calledOnce, 'Call fallback once').to.be.true;
        myToggle.removeAttribute(attributeName);
      });
    });
  });
});
