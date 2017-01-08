/* eslint-env jasmine, mocha */

import { Component, define } from '../../../src/index';

function mockDefine (name) {
  window.customElements.define(name, function customElemMock () {});
}

describe('api/define', () => {
  it('static "is" should be set on the constructor if not specified', () => {
    const Elem = define(class extends HTMLElement {});
    expect(Elem.is).to.contain('x-');
  });

  it('static "is" should be updated if a conflicting "is" was found', () => {
    const Elem1 = define(class extends HTMLElement {
      static is = 'x-test';
    });
    const Elem2 = define(class extends HTMLElement {
      static is = 'x-test';
    });
    expect(Elem1.is).to.not.equal(Elem2.is);
    expect(Elem2.is).to.contain('x-');
  });

  it('static "is" should not change if it was unique already', () => {
    const name = 'x-uber-unique-and-stuff';
    const Elem = define(class extends HTMLElement {
      static is = name
    });
    expect(Elem.is).to.equal(name);
  });

  it('should register components with unique names', () => {
    const name = 'x-test-api-define';
    const elem1 = define(class extends Component {
      static is = name
    });
    const elem2 = define(class extends Component {
      static is = name
    });
    const elem3 = define(class extends Component {
      static is = name
    });

    expect(elem1.is).to.equal('x-test-api-define');
    expect(elem2.is).not.to.equal('x-test-api-define');
    expect(elem3.is).not.to.equal('x-test-api-define');

    expect(elem2.is.indexOf('x-test-api-define') === 0).to.equal(true);    
    expect(elem3.is.indexOf('x-test-api-define') === 0).to.equal(true);
  });

  it('should register components with unique names with multiple versions of skate', () => {
    mockDefine('x-test-api-define-multi', class extends Component {});
    expect(() => {
      define('x-test-api-define-multi', class extends Component {});
    }).to.not.throw();
  });

  it('should throw if the constructor does not extend HTMLElement', () => {
    expect(() => define(() => {})).to.throw();
    expect(() => define(HTMLElement)).to.throw();
  });

  describe('deprecated', () => {
    it('should not register without any properties', () => {
      expect(() => define('x-test')).to.throw(Error);
    });

    it('should take an object and extend Component', () => {
      expect(define('x-test', class extends Component {}).prototype).to.be.an.instanceof(Component);
    });

    it('should be able to take an ES5 extension of Component', () => {
      expect(define('x-test', class extends Component {}).prototype).to.be.an.instanceof(Component);
    });

    it('should take a constructor that extends Component', () => {
      expect(define('x-test', class extends Component {}).prototype).to.be.an.instanceof(Component);
    });
  });
});
