'use strict';

import helpers from '../lib/helpers';
import skate from '../../src/index';

describe('skate.init()', function () {
  var MyEl;
  var tagName;

  beforeEach(function () {
    tagName = helpers.safeTagName('my-el');
    MyEl = skate(tagName.safe, {
      created: function (element) {
        element.textContent = 'test';
      }
    });

    helpers.fixture(`<${tagName.safe}></${tagName.safe}>`);
  });

  it('should accept a selector', function () {
    expect(skate.init(`#${helpers.fixture().id} ${tagName.safe}`).item(0).textContent).to.equal('test');
  });

  it('should accept a node', function () {
    expect(skate.init(helpers.fixture().querySelector(tagName.safe)).textContent).to.equal('test');
  });

  it('should accept a node list', function () {
    expect(skate.init(helpers.fixture().querySelectorAll(tagName.safe)).item(0).textContent).to.equal('test');
  });

  describe('sync', function () {
    it('should take an element', function () {
      var initialised = false;
      var { safe: tagName } = helpers.safeTagName('div');

      skate(tagName, {
        attached: function () {
          initialised = true;
        }
      });

      skate.init(helpers.fixture(`<${tagName}></${tagName}>`).querySelector(tagName));
      expect(initialised).to.equal(true);
    });
  });

  describe('instantiation', function () {
    it('should return a constructor', function () {
      expect(skate(helpers.safeTagName('my-el').safe, {})).to.be.a('function');
    });

    it('should return a new element when constructed.', function () {
      var tag = helpers.safeTagName('my-el');
      var Element = skate(tag.safe, {});
      var element = new Element();
      expect(element.nodeName).to.equal(tag.safe.toUpperCase());
    });

    it('should synchronously initialise the new element.', function () {
      var called = false;
      var tag = helpers.safeTagName('my-el');
      var Element = skate(tag.safe, {
        prototype: {
          someMethod: function () {
            called = true;
          }
        }
      });

      new Element().someMethod();
      expect(called).to.equal(true);
    });

    it('should call lifecycle callbacks at appropriate times.', function (done) {
      var created = false;
      var attached = false;
      var detached = false;
      var tag = helpers.safeTagName('my-el');
      var Element = skate(tag.safe, {
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

      var element = new Element();
      expect(created).to.equal(true, 'Should call created');
      expect(attached).to.equal(false, 'Should not call attached');
      expect(detached).to.equal(false, 'Should not call detached');

      document.body.appendChild(element);
      skate.init(element);
      expect(attached).to.equal(true, 'Should call attached');
      expect(detached).to.equal(false, 'Should not call remove');

      element.parentNode.removeChild(element);

      // Mutation Observers are async.
      setTimeout(function () {
        expect(detached).to.equal(true, 'Should call detached');
        done();
      }, 1);
    });

    it('should initialise multiple instances of the same type of element (possible bug).', function (done) {
      var numCreated = 0;
      var numAttached = 0;
      var numDetached = 0;
      var tag = helpers.safeTagName('my-el');
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

      skate.init(element1);
      skate.init(element2);

      expect(numCreated).to.equal(2, 'created');
      expect(numAttached).to.equal(2, 'attached');

      element1.parentNode.removeChild(element1);
      element2.parentNode.removeChild(element2);

      // Mutation Observers are async.
      helpers.afterMutations(function () {
        expect(numDetached).to.equal(2, 'detached');
        done();
      });
    });

    it('should not throw an error if using an id with the same name as a method / property on the Object prototype', function () {
      var idsToSkate = ['hasOwnProperty', 'watch'];
      var idsToCheck = [];

      var div = document.createElement('div');
      div.className = idsToSkate.join(' ');

      idsToSkate.forEach(function (id) {
        var tag = helpers.safeTagName('my-el');
        skate(tag.safe, {
          type: skate.type.CLASSNAME,
          created: function () {
            idsToCheck.push(id);
          }
        });
      });

      skate.init(div);
    });

    it('should use a tag name equal to the provided one', function () {
      var {safe: tagName} = helpers.safeTagName('my-element');
      var MyElement = skate(tagName, {
        type: skate.type.ELEMENT,
        prototype: {
          returnSelf: function () {
            return this;
          }
        }
      });

      var el = new MyElement();
      expect(el.tagName).to.equal(tagName.toUpperCase());
    });
  });

  describe('duplication', function () {
    function assertType (type, shouldEqual, tagToExtend) {
      it(`type "${type}", extending "${tagToExtend}"`, function () {
        var calls = 0;
        var callsPerCreationType = {};
        var { safe: tagName } = helpers.safeTagName();

        skate(tagName, {
          type: type,
          extends: tagToExtend,
          created: function () {
            ++calls;
          }
        });

        var el1 = document.createElement(tagName);
        skate.init(el1);
        callsPerCreationType[`<${tagName}>`] = calls;

        var el2 = document.createElement('div');
        el2.setAttribute('is', tagName);
        skate.init(el2);
        callsPerCreationType[`<div is="${tagName}">`] = calls;

        var el3 = document.createElement('div');
        el3.setAttribute(tagName, '');
        skate.init(el3);
        callsPerCreationType[`<div ${tagName}>`] = calls;

        var el4 = document.createElement('div');
        el4.className = tagName;
        skate.init(el4);
        callsPerCreationType[`<div class="${tagName}">`] = calls;

        expect(calls).to.equal(shouldEqual, Object.keys(callsPerCreationType).map(function (item) {
          return `${item}: ${callsPerCreationType[item]}`;
        }).join('\n') + '\nOutcome');
      });
    }

    describe('tags, attributes and classes', function () {
      assertType(skate.type.ELEMENT, 1);
      assertType(skate.type.ATTRIBUTE, 1);
      assertType(skate.type.CLASSNAME, 1);
      assertType(skate.type.ELEMENT, 1, 'div');
      assertType(skate.type.ATTRIBUTE, 1, 'div');
      assertType(skate.type.CLASSNAME, 1, 'div');
      assertType(skate.type.ELEMENT, 0, 'span');
      assertType(skate.type.ATTRIBUTE, 0, 'span');
      assertType(skate.type.CLASSNAME, 0, 'span');

      it('should not initialise a single component more than once on a single element', function () {
        var calls = 0;
        var {safe: tagName} = helpers.safeTagName('my-element');

        skate(tagName, {
          created: function () {
            ++calls;
          }
        });

        var el = skate.create(tagName);
        el.setAttribute(tagName, '');
        el.className = tagName;
        expect(calls).to.equal(1);
      });
    });
  });

  describe('forms', function () {
    it('#110 - should initialise forms properly', function () {
      var form = document.createElement('form');
      skate('form', {
        created: function (el) {
          el.initialised = true;
        }
      });

      skate.init(form);
      expect(form.initialised).to.equal(true);
    });
  });
});
