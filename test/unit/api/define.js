import { Component, define, symbols } from '../../../src/index';
import { customElementsV0, customElementsV1 } from '../../../src/util/support';

const { name: $name } = symbols;

function mockDefine(name) {
  if (customElementsV1) {
    window.customElements.define(name, function customElemMock() {}); // eslint-disable-line prefer-arrow-callback
  } else if (customElementsV0) {
    document.registerElement(name, function customElemMock() {}); // eslint-disable-line prefer-arrow-callback
  }
}

describe('api/define', () => {
  it('should not register without any properties', () => {
    expect(() => {
      define('x-test');
    }).to.throw(Error);
  });

  it('should add ____skate_name to the constructor to allow itself (and other versions of skate) to identify it as a component', () => {
    const elem = define('x-test-skate-name', {});
    expect(elem.____skate_name).to.equal('x-test-skate-name');
  });

  it('should register components with unique names', () => {
    const elem1 = define('x-test-api-define', {});
    const elem2 = define('x-test-api-define', {});
    const elem3 = define('x-test-api-define', {});

    // the first one is registered by its own name
    // the rest is registered by the name plus random string
    expect(elem1[$name]).to.equal('x-test-api-define');
    expect(elem2[$name]).not.to.equal('x-test-api-define');
    expect(elem2[$name].indexOf('x-test-api-define') === 0).to.equal(true);
    expect(elem3[$name]).not.to.equal('x-test-api-define');
    expect(elem3[$name].indexOf('x-test-api-define') === 0).to.equal(true);
  });

  it('should register components with unique names with multiple versions of skate', () => {
    mockDefine('x-test-api-define-multi');
    expect(() => {
      define('x-test-api-define-multi', {});
    }).to.not.throw();
  });

  it('should take an object and extend Component', () => {
    expect(define('x-test', {}).prototype).to.be.an.instanceof(Component);
  });

  it('should be able to take an ES5 extension of Component', () => {
    expect(define('x-test', Component.extend({})).prototype).to.be.an.instanceof(Component);
  });

  it('should take a constructor that extends Component', () => {
    expect(define('x-test', class extends Component {}).prototype).to.be.an.instanceof(Component); // eslint-disable-line react/prefer-stateless-function, max-len
  });
});
