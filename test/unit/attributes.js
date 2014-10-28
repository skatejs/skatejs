import helpers from '../lib/helpers';
import skate from '../../src/skate';

describe('Attribute listeners', function () {
  'use strict';

  describe('default values', function () {
    it('should set a default value using the "default" option', function () {
      var MyEl = skate('my-el', {
        attributes: {
          test: {
            default: 'true'
          }
        }
      });

      new MyEl().getAttribute('test').should.equal('true');
    });

    it('should allow a callback to return a default value', function () {
      var MyEl = skate('my-el', {
        attributes: {
          test: {
            default: function () {
              return 'true';
            }
          }
        }
      });

      new MyEl().getAttribute('test').should.equal('true');
    });

    it('should not override if already specified', function () {
      var MyEl = skate('my-el', {
        attributes: {
          test: {
            default: 'true'
          }
        }
      });

      skate.init(helpers.fixture('<my-el test="false"></my-el>'))
        .firstChild
        .test
        .should
        .equal('false');
    });
  });

  describe('should define properties for all watched attributes', function (done) {
    var myEl;
    var created = false;
    var updated = false;
    var removed = false;

    beforeEach(function () {
      var MyEl = skate('my-el', {
        attributes: {
          camelCased: {
            default: 'true'
          },
          'not-camel-cased': {
            default: 'true'
          },
          'test-proxy': {},
          'test-created': {
            default: 'true',
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
            default: 'false'
          }
        },
        prototype: {
          override: 'true'
        }
      });

      myEl = new MyEl();
    });

    it('should respect attributes that are already camel-cased', function () {
      myEl.camelCased.should.equal('true');
    });

    it('should camel-case the property name and leave the attribute name as is', function () {
      myEl.notCamelCased.should.equal('true');
    });

    it('should set the attribute when the property is set', function () {
      myEl.setAttribute('test-proxy', false);
      myEl.testProxy.should.equal('false');
    });

    it('should set the property when the attribute is set', function () {
      myEl.testProxy = true;
      myEl.getAttribute('test-proxy').should.equal('true');
    });

    it('should call created after setting the default value', function (done) {
      helpers.afterMutations(function () {
        myEl.testCreated.should.equal('true');
        created.should.equal(true);
        done();
      });
    });

    it('should call created when the attribute is set for the first time', function (done) {
      myEl.testLifecycle = true;
      helpers.afterMutations(function () {
        myEl.testLifecycle.should.equal('true');
        created.should.equal(true);
        done();
      });
    });

    it('should call updated when the attribute is subsequently set', function (done) {
      myEl.testLifecycle = true;
      myEl.testLifecycle = false;
      helpers.afterMutations(function () {
        updated.should.equal(true);
        done();
      });
    });

    it('should call removed when the attribute is set to "undefined".', function (done) {
      myEl.testLifecycle = true;
      myEl.testLifecycle = undefined;
      helpers.afterMutations(function () {
        removed.should.equal(true);
        done();
      });
    });

    it('should not override an existing property', function (done) {
      myEl.setAttribute('override', 'false');
      helpers.afterMutations(function () {
        myEl.override.should.equal('true');
        done();
      });
    });
  });

  describe('callbacks', function () {
    it('should listen to changes in specified attributes', function (done) {
      var created = false;
      var updated = false;

      skate('my-el', {
        attributes: {
          open: {
            created: function (element, data) {
              created = true;
              data.newValue.should.equal('created');
              element.setAttribute('open', 'updated');
            },
            updated: function (element, data) {
              updated = true;
              data.oldValue.should.equal('created');
              data.newValue.should.equal('updated');
              element.removeAttribute('open');
            },
            removed: function (element, data) {
              created.should.equal(true);
              updated.should.equal(true);
              data.oldValue.should.equal('updated');
              done();
            }
          }
        }
      });

      helpers.fixture('<my-el open="created"></my-el>');
    });

    it('should accept a function insead of an object for a particular attribute definition.', function (done) {
      skate('div', {
        attributes: {
          open: function (element, data) {
            if (data.type === 'created') {
              element.setAttribute('open', 'updated');
            } else if (data.type === 'updated') {
              element.removeAttribute('open');
            } else if (data.type === 'removed') {
              assert(true);
              done();
            }
          }
        }
      });

      helpers.fixture('<div id="attrtest" open="created"></div>');
    });

    it('should accept a function insead of an object for the entire attribute definition.', function (done) {
      skate('div', {
        attributes: function (element, data) {
          if (data.type === 'created') {
            setTimeout(function () {
              element.setAttribute('open', 'updated');
            });
          } else if (data.type === 'updated') {
            setTimeout(function () {
              element.removeAttribute('open');
            });
          } else if (data.type === 'removed') {
            assert(true);
            done();
          }
        }
      });

      helpers.fixture('<div id="attrtest" open="created"></div>');
    });

    it('should allow a catchall callback to be specified that catches all changes (same as passing a function instead of an object)', function (done) {
      var called = 0;
      var MyEl = skate('my-el', {
        attributes: {
          test: {
            catchall: function () {
              ++called;
            }
          }
        }
      });

      var myEl = new MyEl();
      myEl.test = false;
      myEl.test = true;
      myEl.test = undefined;

      helpers.afterMutations(function () {
        called.should.equal(3);
        done();
      });
    });
  });

  describe('Attributes added via HTML', function () {
    it('should ensure attributes are initialised', function () {
      var called = false;
      skate('my-el', {
        attributes: function () {
          called = true;
        }
      });

      skate.init(helpers.fixture('<my-el some-attr></my-el>'));
      expect(called).to.equal(true);
    });
  });

  describe('side effects', function () {
    it('should ensure an attribute exists before trying to action it just in case another attribute handler removes it', function () {
      skate('div', {
        attributes: function (element, data) {
          if (data.name === 'first') {
            element.removeAttribute('second');
          }
        }
      });

      document.body.innerHTML = '<div first="first" second="second"></div>';
      var div = skate.init(document.body.querySelector('div'));
      div.hasAttribute('first').should.equal(true);
      div.hasAttribute('second').should.equal(false);
    });

    it('should iterate over every attribute even if one removed while it is still being processed', function () {
      var attributesCalled = 0;
      skate('my-el', {
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

      skate.init(helpers.fixture('<my-el id="test" name="name"></my-el>'));
      expect(attributesCalled).to.equal(2);
    });
  });
});
