/* eslint-env jasmine, mocha */

import { Component, define, symbols } from '../../../src/index';

const { name: $name } = symbols;

function mockDefine (name) {
  window.customElements.define(name, function customElemMock () {});
}

describe('api/define', () => {
  it('should not register without any properties', () => {
    expect(() => define('x-test')).to.throw(Error);
  });

  it('should add ____skate_name to the constructor to allow itself (and other versions of skate) to identify it as a component', () => {
    const elem = define('x-test-skate-name', class extends Component {});
    expect(elem.____skate_name).to.equal('x-test-skate-name');
  });

  it('should register components with unique names', () => {
    const elem1 = define('x-test-api-define', class extends Component {});
    const elem2 = define('x-test-api-define', class extends Component {});
    const elem3 = define('x-test-api-define', class extends Component {});

    // the first one is registered by its own name
    // the rest is registered by the name plus random string
    expect(elem1[$name]).to.equal('x-test-api-define');
    expect(elem2[$name]).not.to.equal('x-test-api-define');
    expect(elem2[$name].indexOf('x-test-api-define') === 0).to.equal(true);
    expect(elem3[$name]).not.to.equal('x-test-api-define');
    expect(elem3[$name].indexOf('x-test-api-define') === 0).to.equal(true);
  });

  it('should register components with unique names with multiple versions of skate', () => {
    mockDefine('x-test-api-define-multi', class extends Component {});
    expect(() => {
      define('x-test-api-define-multi', class extends Component {});
    }).to.not.throw();
  });

  it('static "is" should be used as "name" argument', () => {
    const name = 'x-test-api-define-is';
    const Elem = define(class extends Component {
      static is = name
    });
    const elem = new Elem();
    expect(elem.localName).to.equal(name);
  });

  it('static "is" should not override "name" argument', () => {
    const name1 = 'x-test-api-define-is-override';
    const name2 = 'x-test-api-define-is-not-override';
    const Elem = define(name2, class extends Component {
      static is = name1
    });
    const elem = new Elem();
    expect(elem.localName).to.equal(name2);
  });

  describe('deprecated', () => {
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
