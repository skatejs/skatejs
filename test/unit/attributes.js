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

    it('should not override if already specified', function () {
      var tagName = helpers.safeTagName('my-el');

      skate(tagName.safe, {
        attributes: {
          test: {
            value: 'true'
          }
        }
      });

      expect(
        skate.init(helpers.fixture('<my-el test="false"></my-el>', tagName))
          .firstChild
          .test
      ).to.equal('false');
    });
  });

  describe('should define properties for all watched attributes', function () {
    var myEl;
    var created = false;
    var updated = false;
    var removed = false;

    beforeEach(function () {
      var tagName = helpers.safeTagName('my-el');
      var MyEl = skate(tagName.safe, {
        attributes: {
          camelCased: {
            value: 'true'
          },
          'not-camel-cased': {
            value: 'true'
          },
          'test-proxy': {},
          'test-created': {
            value: 'true',
            created: function () {
              created = true;
            }
          },
          'test-lifecycle': {
            created: function () {
              created = true;
            },
            updated: function () {
              updated = true;
            },
            removed: function () {
              removed = true;
            }
          },
          'override': {
            value: 'false'
          }
        },
        prototype: {
          override: 'true'
        }
      });

      myEl = new MyEl();
    });

    it('should respect attributes that are already camel-cased', function () {
      expect(myEl.camelCased).to.equal('true');
    });

    it('should camel-case the property name and leave the attribute name as is', function () {
      expect(myEl.notCamelCased).to.equal('true');
    });

    it('should set the attribute when the property is set', function () {
      myEl.setAttribute('test-proxy', false);
      expect(myEl.testProxy).to.equal('false');
    });

    it('should set the property when the attribute is set', function () {
      myEl.testProxy = true;
      expect(myEl.getAttribute('test-proxy')).to.equal('true');
    });

    it('should call created after setting the default value', function () {
      expect(myEl.testCreated).to.equal('true');
      expect(created).to.equal(true);
    });

    it('should call created when the attribute is set for the first time', function () {
      myEl.testLifecycle = true;
      expect(myEl.testLifecycle).to.equal('true');
      expect(created).to.equal(true);
    });

    it('should call updated when the attribute is subsequently set', function () {
      window.doit = true;
      myEl.testLifecycle = true;
      myEl.testLifecycle = false;
      window.doit = false;
      expect(updated).to.equal(true);
    });

    it('should call removed when the attribute is set to "undefined".', function () {
      myEl.testLifecycle = true;
      myEl.testLifecycle = undefined;
      expect(removed).to.equal(true);
    });

    it('should not override an existing property', function () {
      myEl.setAttribute('override', 'false');
      expect(myEl.override).to.equal('true');
    });
  });

  describe('callbacks', function () {
    describe('should listen to changes in specified attributes', function () {
      function createAttributeDefinition () {
        return {
          test: {
            created: function (element, data) {
              expect(data.oldValue).to.equal(null);
              expect(data.newValue).to.equal('created');
            },
            updated: function (element, data) {
              expect(data.oldValue).to.equal('created');
              expect(data.newValue).to.equal('updated');
            },
            removed: function (element, data) {
              expect(data.oldValue).to.equal('updated');
              expect(data.newValue).to.equal(null);
            }
          }
        };
      }

      function assertAttributeChanges (element) {
        element.setAttribute('test', 'created');
        element.setAttribute('test', 'updated');
        element.removeAttribute('test');
      }

      it('for native custom elements', function () {
        var Element = skate(helpers.safeTagName('my-el').safe, {
          attributes: createAttributeDefinition()
        });

        assertAttributeChanges(new Element());
      });

      it('for existing elements (via mutation observer)', function () {
        var { safe: id } = helpers.safeTagName('element');

        skate(id, {
          attributes: createAttributeDefinition()
        });

        assertAttributeChanges(helpers.fixture(`<${id}></${id}>`).querySelector(id));
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

    it('should accept a function insead of an object for a particular attribute definition.', function () {
      var tagName = helpers.safeTagName('my-el');
      var MyEl = skate(tagName.safe, {
        attributes: {
          test: function (element, data) {
            if (data.type === 'created') {
              expect(data.oldValue).to.equal(null);
              expect(data.newValue).to.equal('created');
            } else if (data.type === 'updated') {
              expect(data.oldValue).to.equal('created');
              expect(data.newValue).to.equal('updated');
            } else if (data.type === 'removed') {
              expect(data.oldValue).to.equal('updated');
              expect(data.newValue).to.equal(null);
            }
          }
        }
      });

      var myEl = new MyEl();
      myEl.setAttribute('test', 'created');
      myEl.setAttribute('test', 'updated');
      myEl.removeAttribute('test');
    });

    it('should accept a function insead of an object for the entire attribute definition.', function () {
      var tagName = helpers.safeTagName('my-el');
      var MyEl = skate(tagName.safe, {
        attributes: function (element, data) {
          if (data.name !== 'test') {
            return;
          }

          if (data.type === 'created') {
            expect(data.oldValue).to.equal(null);
            expect(data.newValue).to.equal('created');
          } else if (data.type === 'updated') {
            expect(data.oldValue).to.equal('created');
            expect(data.newValue).to.equal('updated');
          } else if (data.type === 'removed') {
            expect(data.oldValue).to.equal('updated');
            expect(data.newValue).to.equal(null);
          }
        }
      });

      var myEl = new MyEl();
      myEl.setAttribute('test', 'created');
      myEl.setAttribute('test', 'updated');
      myEl.removeAttribute('test');
    });

    describe('should allow a fallback callback to be specified that catches all changes (same as passing a function instead of an object)', function () {
      function assertAttributeLifeycleCalls(nonFallbackHandlers = []) {
        var called = [];
        var {safe: tagName} = helpers.safeTagName('my-el');
        var testHandlers = {
          fallback: function () {
            called.push('fallback');
          }
        };
        nonFallbackHandlers.forEach(function (item) {
          testHandlers[item] = function () {
            called.push(item);
          };
        });

        var MyEl = skate(tagName, {
          attributes: {
            test: testHandlers
          }
        });

        var myEl = new MyEl();
        myEl.test = false;
        myEl.test = true;
        myEl.test = undefined;

        return expect(called);
      }

      it('fallback only', function () {
        assertAttributeLifeycleCalls().to.include.members(['fallback', 'fallback', 'fallback']);
      });

      it('created + fallback', function () {
        assertAttributeLifeycleCalls(['created']).to.include.members(['created', 'fallback', 'fallback']);
      });

      it('updated + fallback', function () {
        assertAttributeLifeycleCalls(['updated']).to.include.members(['fallback', 'updated', 'fallback']);
      });

      it('removed + fallback', function () {
        assertAttributeLifeycleCalls(['removed']).to.include.members(['fallback', 'fallback', 'removed']);
      });
    });
  });

  describe('Attributes added via HTML', function () {
    it('should ensure attributes are initialised', function () {
      var called = false;
      var tagName = helpers.safeTagName('my-el');

      skate(tagName.safe, {
        attributes: function () {
          called = true;
        }
      });

      skate.init(helpers.fixture('<my-el some-attr></my-el>', tagName));
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

    it('should iterate over every attribute even if one removed while it is still being processed', function () {
      var attributesCalled = 0;
      var tagName = helpers.safeTagName('my-el');

      skate(tagName.safe, {
        attributes: {
          id: {
            created: function (element) {
              element.removeAttribute('id');
              attributesCalled++;
            }
          },
          name: {
            created: function (element) {
              element.removeAttribute('name');
              attributesCalled++;
            }
          }
        }
      });

      skate.init(helpers.fixture('<my-el id="test" name="name"></my-el>', tagName));
      expect(attributesCalled).to.equal(2);
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
});
