'use strict';

import helpers from '../lib/helpers';
import skate from '../../src/index';

describe('attributes:', function () {
  describe('default values', function () {
    it('should set a default value using the "value" option', function () {
      var tagName = helpers.safeTagName('my-el');
      var MyEl = skate(tagName.safe, {
        attributes: {
          test: {
            value: 'true'
          }
        }
      });

      expect(new MyEl().getAttribute('test')).to.equal('true');
    });

    it('should allow a callback to return a default value', function () {
      var tagName = helpers.safeTagName('my-el');
      var MyEl = skate(tagName.safe, {
        attributes: {
          test: {
            value: function () {
              return 'true';
            }
          }
        }
      });

      expect(new MyEl().getAttribute('test')).equal('true');
    });
  });

  describe('callbacks', function () {
    describe('should listen to changes in specified attributes', function () {
      var created, updated, removed;

      function createAttributeDefinition () {
        return {
          test: {
            created: () => created = true,
            updated: () => updated = true,
            removed: () => removed = true
          }
        };
      }

      function assertAttributeChanges (element) {
        it('created', function () {
          element.setAttribute('test', 'created');
          expect(created).to.equal(true, 'created');
          expect(updated).to.equal(false, 'updated');
          expect(removed).to.equal(false, 'removed');
        });

        it('updated', function () {
          element.setAttribute('test', 'updated');
          expect(created).to.equal(true, 'created');
          expect(updated).to.equal(true, 'updated');
          expect(removed).to.equal(false, 'removed');
        });

        it('removed', function () {
          element.removeAttribute('test');
          expect(created).to.equal(true, 'created');
          expect(updated).to.equal(true, 'updated');
          expect(removed).to.equal(true, 'removed');
        });
      }

      beforeEach(function () {
        created = false;
        updated = false;
        removed = false;
      });

      it('for native custom elements', function () {
        var Element = skate(helpers.safeTagName().safe, {
          attributes: createAttributeDefinition()
        });

        assertAttributeChanges(new Element());
      });

      it('for existing elements (via mutation observer)', function () {
        var { safe: id } = helpers.safeTagName('element');

        skate(id, {
          attributes: createAttributeDefinition()
        });

        assertAttributeChanges(skate.init(helpers.fixture(`<${id}></${id}>`)).querySelector(id));
      });

      it('for attributes (via mutation observer)', function () {
        var { safe: id } = helpers.safeTagName('attribute');

        skate(id, {
          type: skate.type.ATTRIBUTE,
          attributes: createAttributeDefinition()
        });

        assertAttributeChanges(helpers.fixture(`<div ${id}></div>`).querySelector('div'));
      });

      it('for classnames (via mutation observer)', function () {
        var { safe: id } = helpers.safeTagName('classname');

        skate(id, {
          type: skate.type.CLASSNAME,
          attributes: createAttributeDefinition()
        });

        assertAttributeChanges(helpers.fixture(`<div class="${id}"></div>`).querySelector('div'));
      });
    });

    describe('should accept a function instead of an object', function () {
      var calls = {};

      function assertCalls (elem) {
        it('created', function () {
          calls = {};
          elem.setAttribute('test', 'created');
          expect(calls.created).to.equal(true, 'created');
          expect(calls.updated).to.equal(undefined, 'updated');
          expect(calls.removed).to.equal(undefined, 'removed');
        });

        it('updated', function () {
          calls = {};
          elem.setAttribute('test', 'updated');
          expect(calls.created).to.equal(undefined, 'created');
          expect(calls.updated).to.equal(true, 'updated');
          expect(calls.removed).to.equal(undefined, 'removed');
        });

        it('removed', function () {
          calls = {};
          elem.removeAttribute('test');
          expect(calls.created).to.equal(undefined, 'created');
          expect(calls.updated).to.equal(undefined, 'updated');
          expect(calls.removed).to.equal(true, 'removed');
        });
      }

      describe('for the entire attribute definition.', function () {
        assertCalls(new (skate(helpers.safeTagName().safe, {
          attributes: (elem, diff) => calls[diff.type] = true
        }))());
      });

      describe('for a particular attribute definition', function () {
        assertCalls(new (skate(helpers.safeTagName().safe, {
          attributes: {
            test: (elem, diff) => calls[diff.type] = true
          }
        }))());
      });
    });
  });

  describe('Attributes added via HTML', function () {
    it('should ensure attributes are initialised', function () {
      var called = false;
      var tag = helpers.safeTagName('my-el').safe;

      skate(tag, {
        attributes: () => called = true
      });

      skate.init(helpers.fixture(`<${tag} some-attr></${tag}>`));
      expect(called).to.equal(true);
    });
  });

  describe('side effects', function () {
    it('should ensure an attribute exists before trying to action it just in case another attribute handler removes it', function () {
      var tagName = helpers.safeTagName('my-el');

      skate(tagName.safe, {
        attributes: function (element, data) {
          if (data.name === 'first') {
            element.removeAttribute('second');
          }
        }
      });

      skate.init(helpers.fixture('<my-el first></my-el>', tagName));
      expect(document.querySelector(tagName.safe).hasAttribute('first')).to.equal(true);
      expect(document.querySelector(tagName.safe).hasAttribute('second')).to.equal(false);
    });
  });

  describe('camelCasing', function () {
    var Ctor;
    var triggered;

    beforeEach(function () {
      Ctor = skate(helpers.safeTagName().safe, {
        attributes: {
          myAttribute: function () {
            triggered = true;
          }
        }
      });
      triggered = false;
    });

    it('attribute name in the attribute definition should convert camelCased attribute names to dash-case', function () {
      var el = new Ctor();
      el.setAttribute('my-attribute', '');
      expect(triggered).to.equal(true);
    });
  });

  describe('compound keys ("created updated removed")', function () {
    var calls, inc, tag;

    beforeEach(function () {
      calls = 0;
      inc = () => ++calls;
      tag = helpers.safeTagName().safe;
    });

    it('should allow multiple keys for specific attributes', function () {
      var El = skate(tag, {
        attributes: {
          attr: {
            created: inc,
            updated: inc,
            removed: inc,
            'created updated': inc,
            'updated removed': inc,
            'created removed': inc,
            'created updated removed': inc
          }
        }
      });
      var el = new El();
      el.setAttribute('attr', true);
      el.setAttribute('attr', false);
      el.removeAttribute('attr');
      expect(calls).to.equal(12);
    });
  });
});
