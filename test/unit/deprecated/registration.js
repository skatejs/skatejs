/* eslint-env jasmine, mocha */

import { define } from '../../../src/index';

const { HTMLElement } = window;

describe('Returning a constructor', () => {
  it('should return a constructor that extends a native element.', () => {
    const Element = define({
      prototype: {
        func1: () => {}
      }
    });

    Element.prototype.func2 = () => {};

    expect(Element.prototype.func1).to.be.a('function');
    expect(Element.prototype.func2).to.be.a('function');

    const element = new Element();

    expect(element).to.be.an.instanceof(HTMLElement);

    expect(element.func1).to.be.a('function');
    expect(element.func2).to.be.a('function');

    expect(element.func1).to.equal(Element.prototype.func1);
    expect(element.func2).to.equal(Element.prototype.func2);
  });

  it('should not allow the constructor property to be enumerated.', () => {
    const Element = define({});

    Object.keys(Element.prototype).forEach((prop) => {
      if (prop === 'constructor') {
        throw new Error('The constructor property should not be enumerable.');
      }
    });
  });

  it('should affect the element prototype even if it was not constructed using the constructor.', () => {
    const Element = define({
      prototype: {
        func1: () => {}
      }
    });

    Element.prototype.func2 = () => {};

    const element = new Element();

    expect(element.func1).to.be.a('function');
    expect(element.func2).to.be.a('function');
  });

  it('should allow getters and setters on the prototype', () => {
    const Element = define({
      prototype: Object.create({}, {
        test: {
          get: () => true
        }
      })
    });

    const element = new Element();
    expect(element.test).to.equal(true);
  });

  it('should overwrite prototype members', () => {
    let called = false;
    const Input = define({
      extends: 'input',
      prototype: {
        focus: () => {
          called = true;
        }
      }
    });

    const input = new Input();
    input.focus();
    expect(called).to.equal(true);
  });
});
