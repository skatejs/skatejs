import { define } from '../../src/index';
import helperElement from '../lib/element';

describe('Returning a constructor', function () {
  it('should return a constructor that extends a native element.', function () {
    var tag = helperElement('my-el');
    var Element = define(tag.safe, {
      prototype: {
        func1: function () {}
      }
    });

    Element.prototype.func2 = function () {};

    expect(Element.prototype.func1).to.be.a('function');
    expect(Element.prototype.func2).to.be.a('function');

    var element = new Element();

    expect(element).to.be.an.instanceof(HTMLElement);

    expect(element.func1).to.be.a('function');
    expect(element.func2).to.be.a('function');

    expect(element.func1).to.equal(Element.prototype.func1);
    expect(element.func2).to.equal(Element.prototype.func2);
  });

  it('should not allow the constructor property to be enumerated.', function () {
    var tag = helperElement('my-el');
    var Element = define(tag.safe, {});

    for (var prop in Element.prototype) {
      if (prop === 'constructor') {
        throw new Error('The constructor property should not be enumerable.');
      }
    }
  });

  it('should affect the element prototype even if it was not constructed using the constructor.', function () {
    var tag = helperElement('my-el');
    var Element = define(tag.safe, {
      prototype: {
        func1: function () {}
      }
    });

    Element.prototype.func2 = function () {};

    var element = new Element();

    expect(element.func1).to.be.a('function');
    expect(element.func2).to.be.a('function');
  });

  it('should allow getters and setters on the prototype', function () {
    var tag = helperElement('my-el');
    var Element = define(tag.safe, {
      prototype: Object.create({}, {
        test: {
          get: function () {
            return true;
          }
        }
      })
    });

    var element = new Element();
    expect(element.test).to.equal(true);
  });

  it('should overwrite prototype members', function () {
    var called = false;
    var { safe: tagName } = helperElement('super-input');
    var Input = define(tagName, {
      extends: 'input',
      prototype: {
        focus: function () {
          called = true;
        }
      }
    });

    var input = new Input();
    input.focus();
    expect(called).to.equal(true);
  });
});
