define(['../../src/skate.js', '../lib/helpers.js'], function (skate, helpers) {
  'use strict';

  describe('Registration', function () {
    it('should not allow you to register the same component more than once.', function () {
      var multiple = false;

      skate('div', {});

      try {
        skate('div', {});
        multiple = true;
      } catch (e) {}

      assert(!multiple, 'Multiple "div" components were registered.');
    });

    it('should destroy all listeners when destroy() called', function () {
      skate('div', {
        insert: function (element) {
          element.test = true;
        }
      });

      skate.destroy();
      expect(skate.init(helpers.add('div')).test).to.equal(undefined);
    });

    it('should unregister the specified listener when unregister() called', function () {
      skate('div', {
        insert: function (element) {
          element.test = true;
        }
      });

      skate.unregister('div');
      expect(skate.init(helpers.add('div')).test).to.equal(undefined);
    });

    describe('should generate a selector for the hidden rules', function () {
      function assertSelectorFor (id, type, tagToExtend) {

        skate(id, {
          type: type,
          extends: tagToExtend,
          ready: function (element) {
            expect(window.getComputedStyle(element).display).to.equal('none');
          }
        });

        var div;
        if (tagToExtend) {
          div = document.createElement(tagToExtend);
          div.setAttribute('is', id);
        } else {
          div = document.createElement(id);
        }

        document.body.appendChild(div);
        skate.init(div);
      }

      function describeSelectorTest (id, type, tagToExtend) {
        describe('for ' + type, function () {
          it ('extending ' + tagToExtend, function () {
            assertSelectorFor('my-element', type, 'div');
          });

          it ('not extending', function () {
            assertSelectorFor('my-element', type);
          });
        });
      }

      for (var type in skate.types) {
        if (skate.types.hasOwnProperty(type)) {
          describeSelectorTest(type);
        }
      }
    });
  });

  describe('Returning a constructor', function () {
    it('should return a constructor that extends a native element.', function () {
      var Div = skate('div', {
        prototype: {
          func1: function () {}
        }
      });

      Div.prototype.func2 = function () {};

      expect(Div.prototype.func1).to.be.a('function');
      expect(Div.prototype.func2).to.be.a('function');

      var div = new Div();

      expect(div.func1).to.be.a('function');
      expect(div.func2).to.be.a('function');

      div.func1.should.equal(Div.prototype.func1);
      div.func2.should.equal(Div.prototype.func2);
    });

    it('should not allow the constructor property to be enumerated.', function () {
      var Div = skate('div', {});

      for (var prop in Div.prototype) {
        if (prop === 'constructor') {
          throw new Error('The constructor property should not be enumerable.');
        }
      }
    });

    it('should affect the element prototype even if it was not constructed using the constructor.', function () {
      var Div = skate('div', {
        prototype: {
          func1: function () {}
        }
      });

      Div.prototype.func2 = function () {};

      var div = new Div();

      div.func1.should.be.a('function');
      div.func2.should.be.a('function');
    });

    it('should allow the overwriting of the prototype', function () {
      var Div = skate('div', {});

      Div.prototype = {
        func: function () {}
      };

      var div = new Div();

      div.func.should.be.a('function');
    });

    it('should allow getters and setters on the prototype', function () {
      var Div = skate('div', {
        prototype: Object.create({}, {
          test: {
            get: function () {
              return true;
            }
          }
        })
      });

      var div = new Div();

      expect(div.test).to.equal(true);
    });

    describe('when an extends option is specified', function () {
      var Div;
      var div;

      beforeEach(function () {
        Div = skate('my-element', {
          extends: 'div'
        });

        div = new Div();
      });

      it('should return an element whose tag name matches the extends option', function () {
        expect(div.tagName).to.equal('DIV');
      });

      it('should return an element whose is attribute is equal to the component id', function () {
        expect(div.getAttribute('is')).to.equal('my-element');
      });
    });
  });
});
